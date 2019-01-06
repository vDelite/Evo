const redis = require('redis');
const request = require('superagent');
const discord = require('discord.js');
const logger = require('../util/Logger');

const databases = {
  count: 0,
};

function ReturnPost(message, args, msg) {
  let rnd = Math.floor((Math.random() * databases[args[0]].posts));
  while (databases[args[0]].selected.includes(rnd)) {
    rnd = Math.floor((Math.random() * databases[args[0]].posts));
  }

  const redisClient = redis.createClient();

  redisClient.select(databases[args[0]].db, (err) => {
    if (err) {
      logger.error(err.toString());
      msg.edit('Unknow error.');
      return;
    }

    redisClient.get(rnd.toString(), (suberr, subreply) => {
      if (suberr) {
        logger.error(suberr.toString());
        msg.edit('Unknow error.');
        return;
      }
      if (subreply === null) {
        logger.error(suberr.toString());
        msg.edit('Unknow error.');
        return;
      }

      msg.delete();
      const post = JSON.parse(subreply);

      const embed = new discord.MessageEmbed().setURL(post.full_link).setTitle(`${post.title} by ${post.author}`).setImage(post.image);
      message.channel.send({ embed });

      databases[args[0]].selected.push(rnd);
      redisClient.quit();
    });
  });
}

const Store = async (message, args, msg) => {
  const subbody = await request.get(`https://www.reddit.com/r/${args[0]}/about.json`);
  if (subbody.body.kind !== 't5') await msg.edit('Unknown subreddit!');
  if (subbody.body.data.over18 && !message.channel.nsfw) await message.edit('This is a NSFW subreddit, please try again in a NSFW channel!');

  const link = `https://api.pushshift.io/reddit/search/submission/?subreddit=${args[0]}&sort=desc&sort_type=created_utc&before=${Math.floor((new Date()).getTime() / 1000)}&after=${Math.floor((new Date()).getTime() / 1000) - 86400}&size=200&mod_removed=false&user_removed=false&over_18=false&quarantine=false`;
  const res = await request.get(link);

  const posts = res.body.data;
  let redisClient = redis.createClient();

  databases[args[0]] = {
    db: databases.count,
    posts: posts.length,
    selected: [],
    removeTimer: setTimeout(() => {
      if (!redisClient.connected) redisClient = redis.createClient();
      redisClient.select(databases[args[0]].db, (err) => {
        if (err) {
          logger.error(err.toString());
          return;
        }

        delete databases[args[0]];

        redisClient.flushdb();
        redisClient.quit();
      });
    }, 3600000),
  };
  databases.count += 1;

  redisClient.select(databases[args[0]].db, (err) => {
    if (err) {
      logger.error(err.toString());
      msg.edit('Unknow error.');
    }

    for (let i = 0; i < posts.length; i += 1) {
      redisClient.set(i.toString(), JSON.stringify({
        title: posts[i].title,
        full_link: posts[i].full_link,
        author: posts[i].author,
        image: posts[i].url,
      }));
    }

    redisClient.quit();
    ReturnPost(message, args, msg);
  });
};

exports.run = async (client, message, args) => {
  return message.channel.send('Not read yet, will be in future release');
  if (args.length === 0) await message.channel.send('**Usage** - reddit [subreddit]\nReturns recent random post from given subreddit.');
  const dis = client.emojis.get('472793529609879573');
  if (databases[args[0]] !== undefined) {
    await ReturnPost(message, args, await message.channel.send(`Loading ${dis}`));
  } else {
    await Store(message, args, await message.channel.send(`Loading subreddit ${dis}`));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  hidden: false,
  cooldown: 1,
};

exports.help = {
  name: 'reddit',
  category: 'Miscelaneous',
  description: 'reteurns random post from given subreddit',
  usage: 'reddit subreddit',
};
