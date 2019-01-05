const sqlite = require('sqlite');

class Database {
  constructor() {
    this.openDb();
  }

  async openDb() {
    this.db = await sqlite.open('./data.db');
  }

  async fetchSettings(id) {
    return this.db.get(`SELECT * FROM settings WHERE guild=='${id}'`);
  }

  async saveSettings(id, key, value) {
    return this.db.exec(`UPDATE settings SET ${key}='${value}' WHERE guild==${id}`);
  }
}

module.exports = new Database();
