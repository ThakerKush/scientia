import { taskService } from '../services/taskService';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errs/HttpError';
import { z } from 'zod';

class TaskController {
  taskService = new taskService();

  createTask = async (request: any, response: any, next: any) => {
    try {
      const user = request.user;
      const createdTask = await this.taskService.createTask({
        user: user,
        type: request.body.type,
        is_public: request.body.is_public,
        content: request.body.content,
      });
      response.status(200).json(createdTask);
    } catch (error) {
      next(error);
    }
  };

  getTask = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = request.user;
      const tasks = await this.taskService.getTask({ user: user });
      response.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  forkTask = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const schema = z.string().uuid();
      await schema.parseAsync(request.params.task_uuid).catch((error) => {
        throw new HttpError(400, 'Invalid task uuid');
      });
      const forkData = await this.taskService.forkTask({ user: request.user, task_uuid: request.params.task_uuid });
      response.status(200).json(forkData);
    } catch (error) {
      console.error('[Task Controller] Error while forking task', error);
      next(error);
    }
  };

  deleteTask  =async (request: Request, response:  Response, next: NextFunction) => {
    try{
      const schema = z.string().uuid();
      await schema.parseAsync(request.params.task_uuid).catch((error) => {
        throw new HttpError(400, 'Invalid task uuid');
      });
      const deleteData = await this.taskService.deleteTask({ user_id: request.user.id, task_uuid: request.params.task_uuid });
      response.status(200).json(deleteData);
    }catch(error){
      console.error('[Task Controller] Error while deleting task', error);
      next(error);
    }
    
  }

}

export { TaskController };
