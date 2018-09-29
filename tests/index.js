const { expect } = require('chai');

const transform = require('../src/transform');

/**
 * Helper to test inputs to outputs.
 * @param {String} input - The whole input line.
 * @param {String} output - The input split in ' ',
 */
const transformTest = (input, output = '') => {
  expect(transform(input, input.split(' '))).to.equal(output);
};

describe('compile', () => {
  describe('logs', () => {
    it('should transform a log statement', () => {
      const input = 'log \'Hello, world!\'';
      const output = 'console.log(`Hello, world!`);';
      transformTest(input, output);
    });

    it('should transform a log statement with templates', () => {
      const input = 'log \'Hello, {name}!\'';
      const output = 'console.log(`Hello, ${name}!`);';
      transformTest(input, output);
    });

    it('should throw if a log statement has no single quotes', () => {
      const input = 'log counter';
      expect(() => transformTest(input)).to.throw();
    });
  });

  describe('variables', () => {
    it('should transform a variable declaration', () => {
      const input = 'value counter is 25';
      const output = 'let counter = 25;';
      transformTest(input, output);
    });

    it('should throw if a variable declaration omits initialiser', () => {
      const input = 'value counter';
      expect(() => transformTest(input)).to.throw();
    });

    it('should transform a variable assignment', () => {
      const input = 'counter is 100';
      const output = 'counter = 100;';
      transformTest(input, output);
    });

    it('should transform a variable expression declaration', () => {
      const input = 'value result is 10 + 12';
      const output = 'let result = 10 + 12;';
      transformTest(input, output);
    });

    it('should transform a variable expression assignment', () => {
      const input = 'value result is \'ten\' + \'four\'';
      const output = 'let result = \'ten\' + \'four\';';
      transformTest(input, output);
    });
  });

  describe('control', () => {
    it('should transform an until loop', () => {
      const input = 'until counter equals maximum';
      const output = 'while (counter !== maximum) {';
      transformTest(input, output);
    });

    it('should throw if an until loop omits a limit', () => {
      const input = 'until counter';
      expect(() => transformTest(input)).to.throw();
    });

    it('should transform if statement', () => {
      const input = 'when some_value <= 10'
      const output = 'if (some_value <= 10) {';
      transformTest(input, output); 
    });

    it('should throw for a when statement with incorrect condition', () => {
      const input = 'when some_value 100';
      expect(() => transformTest(input)).to.throw();
    });
  });

  describe('tasks', () => {
    it('should transform a task declaration', () => {
      const input = 'task my_task';
      const output = 'function my_task () {';
      transformTest(input, output);
    });

    it('should transform a task declaration with arguments', () => {
      const input = 'task my_task gets some_value';
      const output = 'function my_task (some_value) {';
      transformTest(input, output);
    });

    it('should throw if a task incorrectly specifies a parameter list', () => {
      const input = 'task my_task some_value';
      expect(() => transformTest(input)).to.throw();
    });

    it('should transform a task end', () => {
      const input = 'end';
      const output = '}';
      transformTest(input, output);
    });

    it('should transform a return statement', () => {
      const input = 'return some_value';
      const output = 'return some_value;';
      transformTest(input, output);
    });

    it('should transform a function invocation', () => {
      const input = 'run increment';
      const output = 'increment();';
      transformTest(input, output);
    });

    it('should transform a function invocation with arguments', () => {
      const input = 'run increment with counter';
      const output = 'increment(counter);';
      transformTest(input, output);
    });

    it('should transform multiple task arguments', () => {
      const input = 'run increment with counter1 counter2';
      const output = 'increment(counter1, counter2);';
      transformTest(input, output);
    });

    it('should throw if function arguments are specified incorrectly', () => {
      const input = 'run increment counter';
      expect(() => transformTest(input)).to.throw();
    });

    it('should transform assigning the result of a task invocation', () => {
      const input = 'counter is run increment with counter';
      const output = 'counter = increment(counter);';
      transformTest(input, output);
    });

    it('should throw if improper variable assignment from task result', () => {
      const input = 'counter is increment with counter';
      expect(() => transformTest(input)).to.throw();
    });

    it('should throw if task arguments are specified without \'with\'', () => {
      const input = 'run increment counter';
      expect(() => transformTest(input)).to.throw();
    });

    it('should transform returning a function invocation', () => {
      const input = 'return run increment with counter';
      const output = 'return increment(counter);';
      transformTest(input, output);
    });
  });

  describe('misc', () => {
    it('should transform an empty line', () => {
      transformTest('', '');
    });

    it('should transform a comment', () => {
      const input = '// This is a comment';
      transformTest(input, input);
    });

    it('should throw for any other kind of input', () => {
      const input = 'the meaning of life';
      expect(() => transformTest(input)).to.throw();
    });
  });
});
