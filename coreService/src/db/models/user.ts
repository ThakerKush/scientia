import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
} from 'sequelize';

//Defines all required attributes for a user
export interface UserAttributes {
  id: number;
  uuid: string;
  username: string;
  email: string;
  password: string;
}

//Defines attributes that are required for creating a row
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

//Defines attributes that sequelize will take care of
export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const User = sequelize.define<UserInstance>(
    'users',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      username: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(50),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(200),
      },
    },
    {
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  User.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());

    delete vals.id;
    delete vals.password;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return User;
};
