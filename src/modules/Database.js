const { Client } = require('pg');

const logger = require('../util/Logger');

const config = require('../config');

class Database {
  constructor() {
    this.openDb();
  }

  async openDb() {
    this.client = new Client(config.pg);
    this.client.connect();
    // probably should check if connection was successful, but idc
    await this.prepeareTable('settings', `CREATE TABLE public.settings ( guild text, settings text ) WITH ( OIDS=FALSE ); ALTER TABLE public.settings OWNER TO ${config.pg.user}; `);
    await this.prepeareTable('role_messages', `CREATE TABLE public.role_messages ( guild text, message text, roles text ) WITH ( OIDS=FALSE ); ALTER TABLE public.role_messages OWNER TO ${config.pg.user}; `);
  }

  async prepeareTable(name, create) {
    const res = await this.client.query('SELECT * FROM information_schema.tables WHERE table_schema = \'public\'  AND table_name = $1', [name]);
    if (res.rows.length === 0) {
      try {
        await this.client.query(create);
        logger.warn(`Created table ${name}`);
      } catch (e) {
        logger.error(`Could not create table ${name}, check SQL create statement: ${e.message}`);
      }
    }
  }

  async fetchSettings(id) {
    const res = await this.client.query('SELECT * FROM settings WHERE guild = $1', [id]);
    return res.rows.length > 0 ? JSON.parse(res.rows[0].settings) : {};
  }

  async saveSettings(id, key, values) {
    const curentSettings = await this.client.query('SELECT * FROM settings WHERE guild = $1 ', [id]);
    if (curentSettings.rows.length === 0) {
      const toSave = {};
      toSave[key] = values[0];
      return this.client.query('INSERT INTO settings (guild, settings) VALUES ($1, $2)', [id, JSON.stringify(toSave)]);
    }
    curentSettings.rows[0][key] = values[0];
    return this.client.query('UPDATE settings SET settings = $1 WHERE guild = $2', [JSON.stringify(curentSettings.rows[0]), id]);
  }

  async fetchReactsToRoles(guildId, messageId) {
    const res = await this.client.query('SELECT * FROM role_messages WHERE guild = $1 AND message = $2', [guildId, messageId]);
    if (res.rows.length === 0) return false;
    return JSON.parse(res.rows[0].roles);
  }

  async saveReactToRole(guildId, messageId, reactsToRoles) {
    const res = await this.client.query('SELECT * FROM role_messages WHERE guild = $1 AND message = $2', [guildId, messageId]);
    if (res.rows.length === 0) return this.client.query('INSERT INTO role_messages (guild, message, roles) VALUES ($1, $2, $3)', [guildId, messageId, JSON.stringify(reactsToRoles)]);

    const currentReactsToRoles = JSON.parse(res.rows[0].roles)
    for (const key in reactsToRoles) if (reactsToRoles.hasOwnProperty(key)) currentReactsToRoles[key] = reactsToRoles[key];

    this.client.query('UPDATE role_messages SET roles = $1 WHERE guild = $2 AND message = $3', [JSON.stringify(currentReactsToRoles), guildId, messageId]);
  }
}

module.exports = new Database();
