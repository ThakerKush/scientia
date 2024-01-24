import { DB } from '../db/models/index';
import axios from 'axios';
import config from '../config';
import { QuizAttributes, Question } from '../interfaces';
import constants from '../config/constants';
import { v4 as uuidv4 } from 'uuid';
import { AttemptAttributes, getQuizAttributes } from '../interfaces';
import { HttpError } from '../errs/HttpError';
import { QuizInstance } from '../db/models/quiz';
import { TaskInstance } from '../db/models/task';
import { QuestionInstance, QuestionCreationAttributes } from '../db/models/question';
import { UserTaskInstance } from '../db/models/userTasks';

type ParsedOpenAIResponse = {
  [key: string]: Question[];
};

class QuizService {
  createQuiz = async (quizData: QuizAttributes) => {
    try {
      if (quizData.type === constants.TASK_TYPE.THEORY) {
        const response = await axios.post(config.GPT_QUIZ, {
          type: constants.TASK_TYPE.THEORY,
          content: quizData.content,
        });

        const quizText: string = response.data;
        console.log('API_RES', quizText);
        const dquiz = await DB.quiz.create({
          uuid: quizData.uuid,
          task_id: quizData.task_id,
        });
        console.log(dquiz.id);
        const parsedQuiz: ParsedOpenAIResponse = JSON.parse(quizText);
        console.log(parsedQuiz);
        console.log(Object.values(parsedQuiz));

        const questionAttributes = Object.values(parsedQuiz)[1].map((ques: Question) => {
          ques.uuid = uuidv4();
          ques.quiz_id = dquiz.id;

          console.log(ques);
          return ques;
        });

        console.log(questionAttributes);

        await DB.question.bulkCreate(questionAttributes);
      } else {
        const response = await axios.post(config.GPT_QUIZ, {
          type: constants.TASK_TYPE.MATH,
          content: quizData.content,
        }); // Your quiz text here
        const quizText: string = response.data;
        console.log('API_RES', quizText);

        const dquiz = await DB.quiz.create({
          uuid: quizData.uuid,
          task_id: quizData.task_id,
        });

        const parsedResponse: ParsedOpenAIResponse = JSON.parse(quizText);
        console.log(parsedResponse);

        const questionAttributes = Object.values(parsedResponse)[1].map((ques: Question) => {
          ques.uuid = uuidv4();
          ques.quiz_id = dquiz.id;
          return ques;
        });

        await DB.question.bulkCreate(questionAttributes);
      }
    } catch (error) {
      console.error('[Quiz Service] Error while creating quiz', error);
      throw error;
    }
  };
  attemptQuiz = async (attemptData: AttemptAttributes) => {
    try {
      const { user } = attemptData;

      const taskWithQuiz = (await DB.task.findOne({
        include: [
          {
            model: DB.quiz,
            required: true,
            include: [{ model: DB.question, required: true }],
            where: { uuid: attemptData.quiz_uuid },
          },
          { model: DB.userTasks, required: false },
        ],
      })) as unknown as TaskInstance & {
        Quiz: QuizInstance & { Questions: Array<QuestionInstance> };
        userTasks: Array<UserTaskInstance>;
      };

      console.log('TASK', taskWithQuiz);

      if (!taskWithQuiz) {
        throw new HttpError(404, 'Invalid quizUUID');
      }

      const userOwnership = taskWithQuiz.userTasks.find((ut) => ut.user_id === user.id);

      console.log('userOwnership', userOwnership);

      if (!userOwnership) {
        throw new HttpError(400, 'User is not allowed to attempt quiz');
      }

      if (userOwnership.is_completed) {
        throw new HttpError(400, 'Quiz already attempted');
      }

      const quiz = taskWithQuiz.Quiz;
      const questions = quiz.Questions;

      let score = 0;
      let incorrectQuestions: string[] = [];
      let correct_questions: string[] = [];

      const questionToCorrectAnswer = new Map<string, number>();

      questions.forEach((ques) => {
        questionToCorrectAnswer.set(String(ques.uuid), ques.correct_answer);
      });

      console.log('QUESTIONS_TO_ANSWERS', questionToCorrectAnswer);

      attemptData.attempt.forEach((attempt: { question: string; answer: number }) => {
        const correctAnswer = questionToCorrectAnswer.get(attempt.question);
        const userAnswer = attempt.answer;

        if (correctAnswer === userAnswer) {
          score++;
          correct_questions.push(attempt.question);
        } else {
          incorrectQuestions.push(attempt.question);
        }
      });

      DB.attempt.create({
        user_id: user.id,
        quiz_id: quiz.id,
        correct_questions: correct_questions,
        incorrect_questions: incorrectQuestions,
        score: score,
        compleated_at: new Date(),
      });

      if (score === questions.length) {
        await DB.userTasks.update({ is_completed: true }, { where: { user_id: user.id, task_id: taskWithQuiz.id } });
      }

      const result = {
        score: score,
        incorrectQuestions: incorrectQuestions,
        correctQuestions: correct_questions,
      };

      return result;
    } catch (error) {
      console.error('[Task Service] Error while attempting quiz', error);
      throw error;
    }
  };
  getQuiz = async (quizData: getQuizAttributes) => {
    try {
      const [results, metadata] = await DB.sequelize
        .query(`SELECT public.quizs.uuid AS quiz_uuid, public.tasks.uuid AS task_uuid
        FROM public.quizs
        INNER JOIN public.tasks ON public.quizs.task_id = public.tasks.id
        WHERE public.quizs.user_id = ${quizData.user_id}`);

      return results;
    } catch (error) {
      console.error('[Quiz Service] Error while creating quiz', error);
      throw error;
    }
  };
}

export { QuizService };
