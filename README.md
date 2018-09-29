# islang

`is` is an experimental simplified language that is transpiled to JavaScript. 
The aim is to create a language for scripting that does not require any 
significantly complex symbols or constructs, so that it can be used by more 
novice programmers to achieve simple tasks.

* [Usage](#usage)
* [Run Tests](#run-tests)
* [Language Manual](#language-manual)
* [Examples](#examples)


## Usage

1. Write a `.is` input file in the `is` language (see below).
2. Run `npm run compile $INPUT_FILE` to transpile to JavaScript.
3. Run the output `build.js` as usual using `node`.

For example, the example test file `example.is`:

`$ npm run compile ./example.is`

`$ node build.js`

> Optionally, specify `--show-source` to see each output line's input included
> as a comment.


## Run Tests

`$ npm test`


## Language Manual

The `is` language follows a similar structure to most other statement-based
languages. The basic concepts are demonstrated below. 

> Note: At the moment, only one operation per line is supported.


### Comments

Comments are signified using `//` at the start of a line.

```
// This is a comment!
```


### Variables

Variables are declared using the `value` keyword, and an initial value.

```
value my_value is 0
```

Variables are reassigned using the `is` keyword.

```
// Set to 10
my_value is 10
```


### Logging

Use the `log` keyword to output strings, optionally including variables with 
a template.

```
value my_value is 10

log 'Your value is now {my_value}'
```


### Functions

Functions are declared using the `task` keyword and ended with the `end` 
keyword. Function parameters must always be declared after `gets`, or `nothing`
if there are no parameters.

```
task increment gets input_value
  return input_value + 1
end
```

Functions are called using the `run` keyword, specifying arguments after `with`.

```
value counter = 1

run increment with counter
```

You can use the return value of a function by combining `is` with `run`:

```
value counter = 0

counter is run increment with counter
```


### Loops

The `until` keyword allows a 'while' style loop to run until the value indicated
by `equals` is reached. As with functions, the `end` keyword tells `is` when the 
loop is finished.

```
value counter is 0
value maximum is 100

until counter equals maximum
  run increment with counter
  log '{counter}'
end
``` 


## Examples

### Fibonacci Sequence

```
task fibonacci gets input
  when input <= 1
    return input
  end

  // return fib(n-1) + fib(n-2); 
  value n_minus_1 is input - 1
  value n_minus_2 is input - 2
  value result_1 is run fibonacci with n_minus_1
  value result_2 is run fibonacci with n_minus_2
  return result_1 + result_2
end

value result is run fibonacci with 9
log 'result: {result}'
```

```
result: 34
```


## TODO List

* Utilities (random numbers, read/write files, HTTP, etc.)
* Handle return values
* Evaluate function calls inline
* Objects?
