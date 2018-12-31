
const convert = require('color-convert')

exports.run = (client, message, args) => {
  let color = args[0]
  if (color && /^#?[0-9a-f]{6}$/i.test(color)) {
    args.color = color.replace('#', '')
  } else if (args[0]) {
    try {
      args.color = convert.keyword.hex(args[0]).replace('#', '')
    } catch (e) {
      args.color = '000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16))
    }
  } else {
    args.color = '000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16))
  }

  message.channel.send({
    embed: {
      color: parseInt(args.color, 16),
      fields: [
        { name: 'HEX', value: `#${args.color}`, inline: true },
        { name: 'RGB', value: `${convert.hex.rgb(args.color)}`, inline: true },
        { name: 'CMYK', value: `${convert.hex.cmyk(args.color)}`, inline: true },
        { name: 'HSL', value: `${convert.hex.hsl(args.color)}`, inline: true },
        { name: 'HSV', value: `${convert.hex.hsv(args.color)}`, inline: true },
        { name: 'HWB', value: `${convert.hex.hwb(args.color)}`, inline: true },
        { name: 'LAB', value: `${convert.hex.lab(args.color)}`, inline: true },
        { name: 'ANSI16', value: `${convert.hex.ansi16(args.color)}`, inline: true },
        { name: 'ANSI256', value: `${convert.hex.ansi256(args.color)}`, inline: true },
        { name: 'XYZ', value: `${convert.hex.xyz(args.color)}`, inline: true },
        { name: 'HCG', value: `${convert.hex.hcg(args.color)}`, inline: true },
        { name: 'Apple', value: `${convert.hex.apple(args.color)}`, inline: true },
        { name: 'Gray', value: `${convert.hex.gray(args.color)}`, inline: true },
        { name: 'CSS Keyword (Approx.)', value: `${convert.hex.keyword(args.color)}`, inline: true }
      ],
      thumbnail: {
        url: `https://dummyimage.com/250/${args.color}/&text=%20`
      }
    }
  }).catch(e => {
    console.log(e)
  })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  requiredPermissions: ['EMBED_LINKS']
}

exports.help = {
  name: 'color',
  category: 'Miscelaneous',
  description: 'color',
  usage: 'color'
}
