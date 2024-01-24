import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DB } from './index';

//Defines all required attributes for a user
interface AttemptAttributes {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  correct_questions: string[];
  incorrect_questions: string[];
  compleated_at: Date;
}

//Defines attributes that are required for creating a row
interface AttemptCreationAttributes extends Optional<AttemptAttributes, 'id'> {}

//Defines attributes that sequelize will take care of
export interface AttemptInstance extends Model<AttemptAttributes, AttemptCreationAttributes>, AttemptAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const Attempts = sequelize.define<AttemptInstance>(
    'Attempts',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      correct_questions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      incorrect_questions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: DB.user,
          key: 'id',
        },
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      compleated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'attempts',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Attempts.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());
    delete vals.user_id;
    delete vals.id;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return Attempts;
};
