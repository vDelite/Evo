const sqlite = require('sqlite');

const logger = require('../util/Logger');

class Database {
  constructor() {
    this.openDb();
  }

  async openDb() {
    this.db = await sqlite.open('./data.db');
    await this.prepeareTable('settings', 'CREATE TABLE "settings" ( `guild` TEXT, `prefix` TEXT, `modLogChannel` TEXT, `modRole` TEXT, `adminRole` TEXT, `systemNotice` INTEGER, `welcomeChannel` TEXT, `welcomeMessage` TEXT, `welcomeEnabled` INTEGER, `whitelistEnabled` INTEGER, `whitelistedCommands` TEXT, `enableAutomod` INTEGER )');
    await this.prepeareTable('roleMessages', 'CREATE TABLE "roleMessages" ( `guild` TEXT, `message` TEXT, `roles` TEXT )');
  }

  async prepeareTable(name, create) {
    const row = await this.db.get('SELECT name FROM sqlite_master WHERE name == ? AND type == "table"', [name]);
    if (row === undefined) {
      try {
        await this.db.run(create);
        logger.warn(`Created table ${name}`);
      } catch (e) {
        logger.error(`Could not create table ${name}, check SQL create statement.`);
      }
    }
  }

  async fetchSettings(id) {
    return this.db.get('SELECT * FROM settings WHERE guild == ?', [id]);
  }

  async saveSettings(id, key, value) {
    if (await this.db.get('SELECT * FROM settings WHERE guild == ? ', [id]) === undefined) {
      await this.db.run('INSERT INTO settings VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [id, null, null, null, null, null, null, null, null, null, null, null]);
    }
    return this.db.exec(`UPDATE settings SET ${key}='${value}' WHERE guild==${id}`); // SQL injection here, this would not be problem if ? and ...params[] were used, but that does not work for some reason..
  }

  async fetchReactsToRoles(guildId, messageId) {
    const row = await this.db.get('SELECT * FROM roleMessages WHERE guild == ? AND message == ?', [guildId, messageId]);
    if(row === undefined)
      return false;
    const ret = {};
    return JSON.parse(row.roles);
    return ret;
  }

  async saveReactToRole(guild, message, reactsToRoles) {
    this.db.run('INSERT INTO roleMessages VALUES (?,?,?)', [guild, message, reactsToRoles]);
  }
}

module.exports = new Database();
