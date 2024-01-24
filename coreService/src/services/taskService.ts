import { DB } from '../db/models/index';
import constants from '../config/constants';
import { QuizService } from './quizService';
import axios from 'axios';
import config from '../config/index';
import { TaskAttributes, AttemptAttributes, getTaskResponse } from '../interfaces/index';
import { v4 as uuidv4 } from 'uuid';
import { QueryTypes } from 'sequelize';
import { TaskInstance } from '../db/models/task';
import { UserTaskInstance } from '../db/models/userTasks';

class taskService {
  user: typeof DB.user;
  quiz: typeof DB.quiz;
  task: typeof DB.task;
  userTask: typeof DB.userTasks;

  quizService: QuizService;

  constructor() {
    this.user = DB.user;
    this.task = DB.task;
    this.quiz = DB.quiz;
    this.userTask = DB.userTasks;

    this.quizService = new QuizService();
  }

  createTask = async (taskData: TaskAttributes) => {
    const { TASK_TYPE } = constants;
    try {
      const user = taskData.user;
      const quizUuid = uuidv4();

      const taskUuid = uuidv4();
      const request = await axios.post(config.GPT_TASK, {
        type: taskData.type,
        content: taskData.content,
      });
      let titleIndex = request.data.indexOf('Title:');
      let contentIndex = request.data.indexOf('Content:');

      const title = request.data.substring(titleIndex + 'Title:'.length, contentIndex).trim();
      const content = request.data.substring(contentIndex + 'Content:'.length).trim();
      console.log(content);
      if (content == null) {
        throw new Error('Recived no datat form chatGPT');
      } else {
        const task = await this.task.create({
          uuid: taskUuid,
          title: title,
          is_public: taskData.is_public,
          type: taskData.type,
          content: content,
          status: false,
        });

        const quiz = await this.quizService.createQuiz({
          type: taskData.type,
          uuid: quizUuid,
          task_id: task.id,
          content,
        });

        await this.userTask.create({
          user_id: user.id,
          task_id: task.id,
        });

        return { content, taskUuid };
      }
    } catch (error) {
      console.error('[Task Service] Error while creating task', error);
      throw error;
    }
  };

  getTask = async (taskData: { user: any }) => {
    try {
      console.log('getTaskHit');
      const user = taskData.user;

      const results: getTaskResponse[] = await DB.sequelize.query(
        `SELECT UT.is_completed, UT.is_forked, T.uuid, T.title, T.type, T.content, Q.uuid as "quiz_uuid"
        FROM public.user_tasks UT
                 INNER JOIN public.tasks T on UT.task_id = T.id
                 INNER JOIN public.quizs Q on T.id = Q.task_id
        WHERE UT.user_id = :user_id;`,
        { replacements: { user_id: user.id }, type: QueryTypes.SELECT }
      );

      return results;
    } catch (error) {
      console.error('[Task Service] Error while getting task', error);
      throw error;
    }
  };

  deleteTask = async (taskData: { user_id: number; task_uuid: string }) => {
    try {
      const userWithTask = (await this.task.findOne({
        where: { uuid: taskData.task_uuid },
        include: [
          {
            model: this.userTask,
            where: { user_id: taskData.user_id },
            required: true,
          },
        ],
      })) as TaskInstance & { userTasks: Array<UserTaskInstance> };

      if (!userWithTask) {
        throw new Error('User does not have this task');
      }
      const { task_id, user_id } = userWithTask.userTasks[0].dataValues;
      const numTask = await this.userTask.count({ where: { task_id: task_id } });

      await this.userTask.destroy({
        where: {
          task_id: task_id,
          user_id: user_id,
        },
      });

      if (numTask == 1) {
        await this.task.destroy({ where: { id: task_id } });
      }

      return 'task deleted';
    } catch (error) {
      console.error('[Task Service] Error while deleting task', error);
      throw error;
    }
  };

  forkTask = async ({ user, task_uuid }: { user: any; task_uuid: string }) => {
    try {
      const task = await DB.task.findOne({ where: { uuid: task_uuid, is_public: true } });

      if (!task) {
        /** @TODO This should be a service error */
        throw new Error('Invalid taskUUID');
      }

      const existingUserTask = await this.userTask.findOne({ where: { user_id: user.id, task_id: task.id } });

      if (existingUserTask) {
        /** @TODO This should be a service error */
        throw new Error(`Cannot fork task since you either own the task or you've already forked it`);
      }

      const newUserTask = await this.userTask.create({ user_id: user.id, task_id: task.id, is_forked: true });

      return { message: 'Task forked successfully' };
    } catch (error) {
      console.error('[Task Service] Error while forking task', error);
      throw error;
    }
  };
}

export { taskService };
