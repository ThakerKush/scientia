'use strict';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import { Sequelize, ModelStatic, DataTypes } from 'sequelize';
import { UserInstance } from './user';
import { TaskInstance } from './task';
import { QuizInstance } from './quiz';
import { QuestionInstance } from './question';
import { AttemptInstance } from './attempt';
import { UserTaskInstance } from './userTasks';
const basename = path.basename(__filename);

interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  user: ModelStatic<UserInstance>;
  task: ModelStatic<TaskInstance>;
  quiz: ModelStatic<QuizInstance>;
  question: ModelStatic<QuestionInstance>;
  attempt: ModelStatic<AttemptInstance>;
  userTasks: ModelStatic<UserTaskInstance>;
}

//@ts-expect-error
export const DB: DB = {};

const sequelize = new Sequelize(config.db.DATABASE, config.db.USERNAME, config.db.PASSWORD, {
  host: config.db.HOST,
  dialect: config.db.DIALECT,
  port: Number(config.db.PORT),
  logging: false,
});

DB.sequelize = sequelize; //connection instance

DB.Sequelize = Sequelize; // library

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(DB.sequelize, DataTypes);
    //@ts-expect-error
    DB[model.name] = model;
  });

Object.keys(DB).forEach((modelName) => {
  //@ts-expect-error
  if (DB[modelName].associate) {
    //@ts-expect-error
    DB[modelName].associate(DB);
  }
});

//define models
DB.user = require('./user')(DB.sequelize, DataTypes);
DB.question = require('./question')(DB.sequelize, DataTypes);
DB.task = require('./task')(DB.sequelize, DataTypes);
DB.quiz = require('./quiz')(DB.sequelize, DataTypes);
DB.attempt = require('./attempt')(DB.sequelize, DataTypes);
DB.userTasks = require('./userTasks')(DB.sequelize, DataTypes);

//define associations

//One-to-many relation between Task and Quiz
DB.task.hasOne(DB.quiz, { foreignKey: 'task_id', onDelete: 'CASCADE' });
DB.quiz.belongsTo(DB.task, { foreignKey: 'task_id' });

// One-to-many relation between Quiz and Question
DB.quiz.hasMany(DB.question, { foreignKey: 'quiz_id', onDelete: 'CASCADE' });
DB.question.belongsTo(DB.quiz, { foreignKey: 'quiz_id' });

// One-to-many relation between User and Attempt
DB.user.hasMany(DB.attempt, { foreignKey: 'user_id' });
DB.attempt.belongsTo(DB.user, { foreignKey: 'user_id' });

// One-to-many relation between Quiz and Attempt
DB.quiz.hasMany(DB.attempt, { foreignKey: 'quiz_id' });
DB.attempt.belongsTo(DB.quiz, { foreignKey: 'quiz_id' });

// Many-to-many relation between user and tasks
DB.user.belongsToMany(DB.task, {
  through: DB.userTasks,
  foreignKey: 'user_id',
  otherKey: 'task_id',
});
DB.task.belongsToMany(DB.user, {
  through: DB.userTasks,
  foreignKey: 'task_id',
  otherKey: 'user_id',
});

DB.task.hasMany(DB.userTasks, { foreignKey: 'task_id' });
