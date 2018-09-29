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

    // Store function return value
    if (tokens.includes('run')) {
      const functionArgs = tokens.slice(6);
      return `let ${tokens[1]} = ${tokens[4]}(${functionArgs.join(', ')});`
    }

    // Use simple expression
    const expression = tokens.slice(3).join(' ');
    return `let ${tokens[1]} = ${expression};`;
  }

  // Variable assignment
  if (tokens[1] === 'is') {
    // Store function return value
    if (tokens.length > 3) {
      if (tokens[2] !== 'run') {
        throw new Error('Assign return value of a task using \'is run\'');
      }

      const functionArgs = tokens.slice(5);
      return `${tokens[0]} = ${tokens[3]}(${functionArgs.join(', ')});`
    }

    // Use simple expression (e.g: result + 1)
    const expression = tokens.slice(2).join(' ');
    return `${tokens[0]} = ${expression};`;
  }

  // If statement
  if (tokens[0] === 'when') {
    if (tokens.length < 4) {
      throw new Error('when statement must specify condition');
    }

    return `if (${tokens[1]} ${tokens[2]} ${tokens[3]}) {`;
  }

  // Until loop
  if (tokens[0] === 'until') {
    if (tokens[2] !== 'equals') {
      throw new Error('until statement must specify limit with \'equals\'');
    }

    return `while (${tokens[1]} !== ${tokens[3]}) {`;
  }

  // Invoke function
  if (tokens[0] === 'run') {
    if (tokens.length > 2 && tokens[2] !== 'with') {
      throw new Error('Task arguments should be specified with \'with\'');
    }

    const functionArgs = tokens.slice(3);
    return `${tokens[1]}(${functionArgs.join(', ')});`;
  }

  // Log statement
  if (tokens[0] === 'log') {
    // Literal or value?
    if (!input.includes('\'')) {
      throw new Error('log must always be passed a string in single quotes, which can include template values with { and }');
    }

    const strStart = input.indexOf('\'') + 1;
    const strEnd = input.indexOf('\'', strStart);
    let logStr = input.substring(strStart, strEnd).split('{').join('${');
    return `console.log(\`${logStr}\`);`;
  }

  // Function declaration start
  if (tokens[0] === 'task') {
    if (tokens.length > 2 && !tokens.includes('gets')) {
      throw new Error('task statement should specify arguments after task name using \'gets\'');
    }

    const functionArgs = tokens.slice(3);
    return `function ${tokens[1]} (${functionArgs.join(', ')}) {`;
  }

  // Function declaration end
  if (tokens[0] === 'end') {
    return '}';
  }

  // Return statement
  if (tokens[0] === 'return') {
    // Return function invocation
    if (tokens[1] === 'run') {
      const functionArgs = tokens.slice(4);
      return `return ${tokens[2]}(${functionArgs.join(', ')});`;
    }

    // Simple expression
    const expression = tokens.slice(1).join(' ');
    return `return ${expression};`;
  }

  throw new Error(`Invalid statement: ${input}`);
};

module.exports = transform;
