const { Client } = require('pg')

module.exports = class Db {
    constructor() {
      this.client = new Client({
        user: "natanjourno",
        host: "127.0.0.1",
        database: "cheesebot_api",
        password : "",
        port: 5432
      });
      this.client.connect()
      console.log('Base de données connectée')
    }
}
