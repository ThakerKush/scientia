import { Router } from "express";
import { validate } from "../middleware/validate";
import { z } from "zod";
import { UserController } from "../controller/userController";
import authenticate from "../middleware/authenticate";

class AuthRoutes {
  public path = "/";
  public router;
  public userCont;

  constructor() {
    this.userCont = new UserController();
    this.router = Router();
    this.startRoutes();
  }

  private startRoutes() {
    this.router.post(
      `${this.path}signup`,
      validate(
        z.object({
          username: z.string(),
          email: z.string().email(),
          password: z.string(),
        })
      ),
      this.userCont.createUser
    );

    this.router.post(
      `${this.path}login`,
      validate(
        z.object({
          usernameOrEmail: z.string(),
          password: z.string(),
        })
      ),

      this.userCont.loginUser
    );
  }
}

export { AuthRoutes };
