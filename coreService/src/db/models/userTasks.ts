import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { DB } from './index';

interface UserTaskAttributes {
  user_id: number;
  task_id: number;
  is_forked: boolean;
  is_completed: boolean;
}

//Defines attributes that are required for creating a row
interface UserTaskCreationAttributes extends Optional<UserTaskAttributes, 'is_forked' | 'is_completed'> {}

export interface UserTaskInstance extends Model<UserTaskAttributes, UserTaskCreationAttributes>, UserTaskAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const userTasks = sequelize.define(
    'userTasks',
    {
      user_id: {
        type: DataTypes.BIGINT,
        references: {
          model: DB.user, // remaning
          key: 'id',
        },
      },
      task_id: {
        type: DataTypes.BIGINT,
        references: {
          model: DB.task,
          key: 'id',
        },
      },
      is_forked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'user_tasks',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return userTasks;
};
