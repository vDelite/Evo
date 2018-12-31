module.exports = async (client) => {
  await client.wait(500);

  client.appInfo = await client.fetchApplication();
  setInterval(async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);

  if (!client.settings.has('default')) {
    if (!client.config.defaultSettings) throw new Error('defaultSettings not preset in config.js or settings database. Bot cannot load.');
    client.settings.set('default', client.config.defaultSettings);
  }

  client.logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'ready');
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, { type: 'WATCHING' });
};
