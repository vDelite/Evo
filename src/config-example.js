const config = {
  ownerID: '111111111111111111',
  admins: [],

  token: '',

  pg: { // pg db settings
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  },

  dashboard: {
    oauthSecret: '',
    callbackURL: '',
    sessionSecret: '',
    domain: 'localhost',
    port: 808,
  },

  defaultSettings: {
    prefix: '-',
    modLogChannel: 'mod-log',
    modRole: 'Moderator',
    adminRole: 'Administrator',
    systemNotice: 'true',
    welcomeChannel: 'welcome',
    welcomeMessage: 'Welcome {{user}}!',
    welcomeEnabled: 'false',
    whitelistEnabled: 'false',
    whitelistedCommands: 'set,help',
    enableAutomod: 'false',
  },

  permLevels: [
    {
      level: 0,
      name: 'User',
      check: () => true,
    },

    {
      level: 2,
      name: 'Moderator',
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(
            r => r.name.toLowerCase() === message.settings.modRole.toLowerCase(),
          );
          if (modRole && message.member.roles.has(modRole.id)) {
            return true;
          }
        } catch (e) {
          return false;
        }
      },
    },

    {
      level: 3,
      name: 'Administrator',
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(
            r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase(),
          );
          return (adminRole && message.member.roles.has(adminRole.id)) || message.member.hasPermission('ADMINISTRATOR');
        } catch (e) {
          return false;
        }
      },
    },
    {
      level: 4,
      name: 'Server Owner',
      check: message => (message.channel.type === 'text' ? (message.guild.ownerID === message.author.id) : false),
    },

    {
      level: 9,
      name: 'Bot Admin',
      check: message => config.admins.includes(message.author.id),
    },

    {
      level: 10,
      name: 'Bot Owner',
      check: message => message.client.config.ownerID === message.author.id,
    },
  ],
};

module.exports = config;
