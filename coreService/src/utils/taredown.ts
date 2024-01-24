import { app } from '../App';
import { DB } from '../db/models';

export default async function teardown() {
  await app.close();
  await DB.sequelize.close();
}
