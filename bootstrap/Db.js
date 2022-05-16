// If you want to create a separate db file
const { Client } = require('pg')

module.exports = class Db {
    constructor() {
      this.client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });
      this.client.connect()
      console.log('Base de données connectée')
    }
}
