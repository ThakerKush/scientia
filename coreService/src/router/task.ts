import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { TaskController } from '../controller/taskController';
import { z } from 'zod';
import constants from '../config/constants';

class TaskRoutes {
  public path = '/task';
  public router;
  public taskCont;

  constructor() {
    this.taskCont = new TaskController();
    this.router = Router();
    this.startRoutes();
  }

  private startRoutes() {
    this.router.post(
      `${this.path}/create`,
      authenticate,
      validate(
        z.object({
          type: z.enum([constants.TASK_TYPE.MATH, constants.TASK_TYPE.THEORY]),
          content: z.string(),
          is_public: z.boolean(),
        })
      ),

      this.taskCont.createTask
    ),
      this.router.get(`${this.path}/getTask`, authenticate, this.taskCont.getTask),
      this.router.delete(`${this.path}/:task_uuid/deleteTask`, authenticate, this.taskCont.deleteTask),
      this.router.post(`${this.path}/:task_uuid/fork`, authenticate, this.taskCont.forkTask);
  }
}

export { TaskRoutes };
