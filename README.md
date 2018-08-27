# islang

`is` is an experimental simplified language that is transpiled to JavaScript. 
The aim is to create a language for scripting that does not require any 
significantly complex symbols or constructs, so that it can be used by more 
novice programmers to achieve simple tasks.


## Usage

1. Write a `.is` input file in the `is` language (see below).
2. Run `npm run compile $INPUT_FILE $OUTPUT_FILE` to transpile to JavaScript.
3. Run the `$OUTPUT_FILE` as usual using `node`.

For example, the example test file `test.is`:

`$ npm run compile ./test.is output.js`

> Optionally, specify `--show-source` to see each output line's input included
> as a comment.


## Language Basics

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

Functions are called using the `run` keyword.

```
value counter = 1

run increment counter
```


### Loops

The `until` keyword allows a 'while' style loop to run until the value indicated
by `equals` is reached. As with functions, the `end` keyword tells `is` when the 
loop is finished.

```
value counter is 0
value maximum is 100

until counter equals maximum
  run increment counter
  log '{counter}'
end
``` 


## TODO List

* Utilities (random numbers, read/write files, HTTP, etc.)
* Handle return values
* Evaluate function calls inline
* Objects?
