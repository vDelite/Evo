
function parseArgs(value) {
  const argRegexp = /(--?[a-zA-Z]+)[:\s=]?([A-Z]:(?:\\[\w\s-]+)+\\?(?=\s-)|"[^"]*"|[^-][^\s]*)?/gi;
  const matches = [];

  let match;
  do {
    match = argRegexp.exec(value);
    if (match !== null) {
      matches.push(match[0]);
    }
  } while (match !== null);

  return matches;
}

function mapArgs(args) {
  const flags = {};

  args.forEach((arg) => {
    const param = arg.split(' ');
    const flag = param.shift().slice(1);
    const data = param.join(' ').replace(/^"/, '').replace(/"$/, '');

    flags[flag] = data;
  });
  return flags;
}

module.exports = str => mapArgs(parseArgs(str));
