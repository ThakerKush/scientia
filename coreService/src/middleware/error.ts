import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errs/HttpError";

const errorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";

    res.status(status).send({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
