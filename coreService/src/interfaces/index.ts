
import constants from '../config/constants';

export interface TaskAttributes {
  user: any;
  is_public: boolean;
  type: keyof typeof constants.TASK_TYPE;
  content: string;
}

export interface QuizAttributes {
  type: keyof typeof constants.TASK_TYPE;
  task_id: number;
  uuid: string;
  content: string;
}

export interface Question {
  quiz_id: number;
  uuid: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface AttemptAttributes{
  user: {username: string, id: number};
  quiz_uuid: string;
  attempt: { question: string; answer: number }[];
}

export interface userData {
  email: string;
  uuid: string;
  username: string;
  password: string;
  usernameOrEmail: string;
}

export interface getQuizAttributes{
  user_id: number;
}

export interface getTaskResponse {
  uuid: string;
  content: string;
  title: string;

  quiz_uuid: string;
}
