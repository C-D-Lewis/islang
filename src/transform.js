const { ImportText } = require('./util');

/**
 * Transform a line of is into a line of JS.
 *
 * @param {String} input - The entire input line.
 * @param {String[]} tokens - The tokens of the line split on ' '.
 * @returns {String} The line of JS.
 */
const transform = (input, tokens) => {
  const [t0, t1, t2, t3, t4, t5, t6] = tokens;

  // Empty line
  if (!input.length) {
    return '';
  }

  // Comment
  if (input.startsWith('//')) {
    return input;
  }

  // Variable declaration
  if (t0 === 'value') {
    if (t2 !== 'is') {
      throw new Error('value statement should include \'is\' to initialise it with a value');
    }

    // Store function return value
    if (tokens.includes('from')) {
      return `let ${t1} = await ${t4}(${tokens.slice(6).join(', ')});`
    }

    // Use simple expression
    return `let ${t1} = ${tokens.slice(3).join(' ')};`;
  }

  // Variable assignment
  if (t1 === 'is') {
    // Store function return value
    if (tokens.length > 3) {
      if (t2 !== 'from') {
        throw new Error('Assign return value of a task using \'is from\'');
      }

      return `${t0} = ${t3}(${tokens.slice(5).join(', ')});`
    }

    // Use simple expression (e.g: result + 1)
    return `${t0} = ${tokens.slice(2).join(' ')};`;
  }

  // If statement
  if (t0 === 'when') {
    if (tokens.length < 4) {
      throw new Error('when statement must specify condition');
    }

    return `if (${t1} ${t2} ${t3}) {`;
  }

  // Until loop
  if (t0 === 'until') {
    if (t2 !== 'equals') {
      throw new Error('until statement must specify limit with \'equals\'');
    }

    return `while (${t1} !== ${t3}) {`;
  }

  // Invoke function
  if (t0 === 'run') {
    if (tokens.length > 2 && t2 !== 'with') {
      throw new Error('Task arguments should be specified with \'with\'');
    }

    return `${t1}(${tokens.slice(3).join(', ')});`;
  }

  // Log statement
  if (t0 === 'log') {
    // Literal or value?
    if (!input.includes('\'')) {
      throw new Error('log must always be passed a string in single quotes, which can include template values with { and }');
    }

    const strStart = input.indexOf('\'') + 1;
    const strEnd = input.indexOf('\'', strStart);
    const logStr = input.substring(strStart, strEnd).split('{').join('${');
    return `console.log(\`${logStr}\`);`;
  }

  // Function declaration start
  if (t0 === 'task') {
    if (tokens.length > 2 && !tokens.includes('gets')) {
      throw new Error('task statement should specify arguments after task name using \'gets\'');
    }

    return `async function ${t1} (${tokens.slice(3).join(', ')}) {`;
  }

  // Function declaration end
  if (t0 === 'end') {
    return '}';
  }

  // Return statement
  if (t0 === 'return') {
    // Return function invocation
    if (t1 === 'run') {
      return `return ${t2}(${tokens.slice(4).join(', ')});`;
    }

    // Simple expression
    return `return ${tokens.slice(1).join(' ')};`;
  }

  // Object declaration
  if (t0 === 'object') {
    return `let ${t1} = {};`;
  }

  // Object properties
  if (t1 === 'property') {
    if (t3 !== 'is') {
      throw new Error('Object property must declare an initial value using \'is\'');
    }

    return `${t0}['${t2}'] = ${t4};`;
  }

  // Import some node libraries
  if (t0 === 'using') {
    const map = {
      fetch: ImportText.fetch,
    };

    if (!map[t1]) {
      throw new Error(`'using' specified an unavailable library. Choose from: ${Object.keys(map).join(', ')}.`);
    }

    return map[t1];
  }

  throw new Error(`Invalid statement: ${input}`);
};

module.exports = transform;
