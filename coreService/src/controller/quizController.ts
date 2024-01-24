import { QuizService } from '../services/quizService';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HttpError } from '../errs/HttpError';
class QuizController {
  quizService = new QuizService();

  attemptQuiz = async (request: Request, response: any, next: any) => {
    try {
      const { user } = request;

      const schema = z.string().uuid();

      await schema.parseAsync(request.params.quiz_uuid).catch((error) => {
        throw new HttpError(400, 'Invalid quiz uuid');
      });

      const data = { user: user, quiz_uuid: request.params.quiz_uuid, attempt: request.body.attempt };
      const attemptData = await this.quizService.attemptQuiz(data);

      response.status(200).send(attemptData);
    } catch (error) {
      console.error('[quizController] Error while getting quiz', error);
      next(error);
    }
  };
  getQuiz = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = request.user;
      if (!request.params.quiz_uuid) {
        const quizs = await this.quizService.getQuiz({ user_id: user.id });
        response.status(200).json(quizs);
      } else {
        const quizs = await this.quizService.getQuiz({ user_id: user.id });
        response.status(200).json(quizs);
      }
    } catch (error) {
      console.error('[quizController] Error while getting quiz', error);
      next(error);
    }
  };
}

export { QuizController };
