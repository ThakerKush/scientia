const { SlonikMigrator } = require("@slonik/migrator");
const { createPool } = require("slonik");

require("dotenv").config();

const slonik = createPool(
  `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`
);

const migrator = new SlonikMigrator({
  migrationsPath: __dirname + "/migrations",
  migrationTableName: "migration",
  slonik,
});

migrator.runAsCLI();
