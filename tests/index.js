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
  describe('misc', () => {
    it('should transform an empty line', () => {
      transformTest('', '');
    });

    it('should transform a comment', () => {
      const input = '// This is a comment';
      transformTest(input, input);
    });
  });

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
      const run = () => transformTest(input);
      expect(run).to.throw();
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
      const run = () => transformTest(input);
      expect(run).to.throw();
    });

    it('should transform a variable assignment', () => {
      const input = 'counter is 100';
      const output = 'counter = 100;';
      transformTest(input, output);
    });
  });

  describe('loops', () => {
    it('should transform an until loop', () => {
      const input = 'until counter equals maximum';
      const output = 'while (counter !== maximum) {';
      transformTest(input, output);
    });

    it('should throw if an until loop omits a limit', () => {
      const input = 'until counter';
      const run = () => transformTest(input);
      expect(run).to.throw();
    });
  });

  describe('functions', () => {
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

    it('should throw if function arguments are specified incorrectly', () => {
      const input = 'run increment counter';
      const run = () => transformTest(input);
      expect(run).to.throw();
    });
  });

  describe('tasks', () => {
    it('should transform a task declaration', () => {
      const input = 'task mytask gets somevalue';
      const output = 'function mytask (somevalue) {';
      transformTest(input, output);
    });

    it('should throw if a task does not specify a parameter list', () => {
      const input = 'task mytask';
      const run = () => transformTest(input);
      expect(run).to.throw();
    });

    it('should transform a task end', () => {
      const input = 'end';
      const output = '}';
      transformTest(input, output);
    });

    it('should transform a return statement', () => {
      const input = 'return somevalue';
      const output = 'return somevalue;';
      transformTest(input, output);
    });
  });
});
