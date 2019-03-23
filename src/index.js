const fs = require('fs');

const transform = require('./transform');

const OPTIONS = {
  showSource: process.argv.includes('--show-source'),
};

const getIndentLevel = (line) => {
  const chars = line.split('');
  let numSpaces = 0;
  while (chars[numSpaces] === ' ') {
    numSpaces += 1;
  }

  if (numSpaces % 2 !== 0) {
    throw new Error(`Odd indentation (must be multiple of two spaces):\n '${line}'`);
  }

  return numSpaces / 2;
};

const createJsFile = (lines) => {
  let output = '// compiled from islang source\n// https://github.com/C-D-Lewis/islang\n\n';

  lines.forEach((line) => {
    const indentLevel = getIndentLevel(line);
    const input = line.trim();

    // Optionally annotate with source line
    output += ' '.repeat(indentLevel * 2);
    if (OPTIONS.showSource && input.length) {
      output += `// ${input}\n` + ' '.repeat(indentLevel * 2);
    }
    const tokens = input.split(' ');

    output += transform(input, tokens) + '\n';
  });

  return output;
};

const main = () => {
  try {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      throw new Error('Input path argument required.');
    }

    const [inputPath] = args;
    const lines = fs.readFileSync(`${__dirname}/../${inputPath}`, 'utf8').split('\n');
    const outputLines = createJsFile(lines);
    fs.writeFileSync(`${__dirname}/../build.js`, outputLines, 'utf8');
  } catch (e) {
    console.log(e.message);
  }
};

main();

