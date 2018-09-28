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

const processLines = (lines) => {
  let output = '// compiled from islang source\n\n';
  lines.forEach((line) => {
    const indentLevel = getIndentLevel(line);
    const input = line.trim();

    // Empty line
    if (!input.length) {
      output += '\n';
      return;
    }

    // Optionally annotate with source line
    output += ' '.repeat(indentLevel * 2);
    if (OPTIONS.showSource) {
      output += `// ${input}\n` + ' '.repeat(indentLevel * 2);
    }
    const tokens = input.split(' ');
    
    // Comment
    if (input.startsWith('//')) {
      return;
    }

    // Variable declaration
    if (input.startsWith('value ')) {
      if (!tokens.includes('is')) {
        throw new Error('value statement should include \'is\' to initialise it with a value');
      }

      const varValue = tokens[3];
      output += `let ${tokens[1]} = ${varValue};\n`;
      return;
    }

    // Variable assignment
    if (input.includes(' is ')) {
      const varValue = tokens.slice(2).join(' ');
      output += `${tokens[0]} = ${varValue};\n`;
      return;
    }

    // Until loop
    if (input.startsWith('until ')) {
      if (!tokens.includes('equals')) {
        throw new Error('until statement must specify limit with \'equals\'');
      }

      output += `while(${tokens[1]} !== ${tokens[3]}) {\n`;
      return;
    }

    // Invoke function
    if (input.startsWith('run ')) {
      const functionArgs = tokens.slice(3);
      output += `${tokens[1]}(${functionArgs.join(',')});\n`;
      return;
    }

    // Log statement
    if (input.startsWith('log ')) {
      // Literal or value?
      if (!input.includes('\'')) {
        throw new Error('log must always be passed a string, which can include template values with { and }');
      }

      const strStart = input.indexOf('\'') + 1;
      const strEnd = input.indexOf('\'', strStart);
      let logStr = input.substring(strStart, strEnd).split('{').join('${');
      output += `console.log(\`${logStr}\`);\n`;
      return;
    }

    // Function declaration start
    if (input.startsWith('task ')) {
      if (!tokens.includes('gets')) {
        throw new Error('task statement should include arguments after task name using \'gets\'');
      }

      const functionArgs = tokens.slice(3).filter(item => item !== 'nothing');
      output += `function ${tokens[1]}(${functionArgs.join(',')}) {\n`;
      return;
    }

    // Function declaration end
    if (input === 'end') {
      output += '}\n';
      return;
    }

    // Return statement
    if (input.startsWith('return')) {
      output += `return ${tokens.slice(1).join(' ')};\n`;
      return;
    }
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
