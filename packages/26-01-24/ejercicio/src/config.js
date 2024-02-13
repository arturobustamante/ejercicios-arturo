const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USERDB, process.env.PASSWDB, {
  host: process.env.HOSTDB,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

module.exports = sequelize;