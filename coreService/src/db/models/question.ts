import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DB } from './index';

//Defines all required attributes for a user
interface QuestionAttributes {
  id: number;
  uuid: string;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

//Defines attributes that are required for creating a row
export interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

//Defines attributes that sequelize will take care of
export interface QuestionInstance extends Model<QuestionAttributes, QuestionCreationAttributes>, QuestionAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const Questions = sequelize.define<QuestionInstance>(
    'Questions',
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
      quiz_id: {
        type: DataTypes.INTEGER,
        references: {
          model: DB.quiz,
          key: 'id',
        },
        allowNull: false,
      },
      question: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      options: {
        allowNull: false,
        type: DataTypes.JSON,
      },
      correct_answer: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'questions',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Questions.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());

    delete vals.id;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return Questions;
};
