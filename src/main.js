const fs = require('fs');

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

/**
 * Transform a line of is into a line of JS
 * @param {String} input - The entire input line.
 * @param {String[]} tokens - The tokens of the line split on ' '.
 * @returns {String} The line of JS.
 */
const transform = (input, tokens) => {
  // Empty line
  if (!input.length) {
    return '';
  }

  // Comment
  if (input.startsWith('//')) {
    return input;
  }

  // Variable declaration
  if (tokens[0] === 'value') {
    if (tokens[2] !== 'is') {
      throw new Error('value statement should include \'is\' to initialise it with a value');
    }

    const varValue = tokens[3];
    return `let ${tokens[1]} = ${varValue};`;
  }

  // Variable assignment
  if (tokens[1] === 'is') {
    const varValue = tokens.slice(2).join(' ');
    return `${tokens[0]} = ${varValue};`;
  }

  // Until loop
  if (tokens[0] === 'until') {
    if (tokens[2] !== 'equals') {
      throw new Error('until statement must specify limit with \'equals\'');
    }

    return `while(${tokens[1]} !== ${tokens[3]}) {`;
  }

  // Invoke function
  if (tokens[0] === 'run') {
    const functionArgs = tokens.slice(3);
    return `${tokens[1]}(${functionArgs.join(',')});`;
  }

  // Log statement
  if (tokens[0] === 'log') {
    // Literal or value?
    if (!input.includes('\'')) {
      throw new Error('log must always be passed a string, which can include template values with { and }');
    }

    const strStart = input.indexOf('\'') + 1;
    const strEnd = input.indexOf('\'', strStart);
    let logStr = input.substring(strStart, strEnd).split('{').join('${');
    return `console.log(\`${logStr}\`);`;
  }

  // Function declaration start
  // TODO: Make gets optional for simple functions
  if (tokens[0] === 'task') {
    if (!tokens.includes('gets')) {
      throw new Error('task statement should include arguments after task name using \'gets\'');
    }

    const functionArgs = tokens.slice(3).filter(item => item !== 'nothing');
    return `function ${tokens[1]}(${functionArgs.join(',')}) {`;
  }

  // Function declaration end
  if (tokens[0] === 'end') {
    return '}';
  }

  // Return statement
  if (tokens[0] === 'return') {
    return `return ${tokens.slice(1).join(' ')};`;
  }
};

const processLines = (lines) => {
  let output = '// compiled from islang source\n\n';
  lines.forEach((line) => {
    const indentLevel = getIndentLevel(line);
    const input = line.trim();

    // Optionally annotate with source line
    output += ' '.repeat(indentLevel * 2);
    if (OPTIONS.showSource) {
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
    if (args.length < 2) {
      throw new Error('Two args required - input path and output path');
    }

    const [inputPath, outputPath] = args;
    const lines = fs.readFileSync(`${__dirname}/../${inputPath}`, 'utf8').split('\n');
    const outputLines = processLines(lines);
    fs.writeFileSync(`${__dirname}/../${outputPath}`, outputLines, 'utf8');
  } catch (e) {
    console.log(e.message);
  }
};

main();

