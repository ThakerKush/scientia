import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DB } from './index';

//Defines all required attributes for a user
interface QuizAttributes {
  id: number;
  uuid: string;
  task_id: number;
}

//Defines attributes that are required for creating a row
interface QuizCreationAttributes extends Optional<QuizAttributes, 'id'> {}

//Defines attributes that sequelize will take care of
export interface QuizInstance extends Model<QuizAttributes, QuizCreationAttributes>, QuizAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const Quizs = sequelize.define<QuizInstance>(
    'Quizs',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      task_id: {
        type: DataTypes.INTEGER,
        references: {
          model: DB.task,
          key: 'id',
        },
        allowNull: false,
      },
    },
    {
      tableName: 'quizs',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Quizs.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());

    delete vals.id;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return Quizs;
};
