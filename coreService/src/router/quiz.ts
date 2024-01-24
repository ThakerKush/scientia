import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { QuizController } from '../controller/quizController';
import { z } from 'zod';
import constants from '../config/constants';

class QuizRoutes {
  public path = '/quiz';
  public router;
  public quizCont;

  constructor() {
    this.quizCont = new QuizController();
    this.router = Router();
    this.startRoutes();
  }
  private startRoutes() {
    this.router.get(`${this.path}/`, authenticate, this.quizCont.getQuiz);

    this.router.post(
      `${this.path}/:quiz_uuid/attempt`,
      authenticate,
      validate(
        z.object({
          attempt: z.array(z.object({ question: z.string(), answer: z.number() })),
        })
      ),
      this.quizCont.attemptQuiz
    );
  }
}

export { QuizRoutes };
