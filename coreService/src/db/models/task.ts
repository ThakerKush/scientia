import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DB } from './index';
import constants from '../../config/constants';

//Defines all required attributes for a user
interface TaskAttributes {
  id: number;
  uuid: string;
  title: string;
  is_public: boolean;
  type: keyof typeof constants.TASK_TYPE;
  content: string;
  status: boolean;
}

//Defines attributes that are required for creating a row
interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

//Defines attributes that sequelize will take care of
export interface TaskInstance extends Model<TaskAttributes, TaskCreationAttributes>, TaskAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const Tasks = sequelize.define<TaskInstance>(
    'Tasks',
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
      type: {
        allowNull: true,
        type: DataTypes.ENUM(constants.TASK_TYPE.MATH, constants.TASK_TYPE.THEORY),
      },
      is_public: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      status: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: 'tasks',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Tasks.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());
    delete vals.user_id;
    delete vals.id;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return Tasks;
};
