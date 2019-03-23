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

value my_value is 25 + 100
```

Variables are reassigned using the `is` keyword.

```
my_value is 10

my_value is 'hello' + 'world'
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
task greet gets name
  log 'Hello there, {name}!'
end

value name is 'Chris'
run greet with name
```

You can use the return value of a function by combining `is` with `run` (and optionally `with`):

```
value result is run fibonacci with 9
```


### If

An 'if' style statement can be used with `when` and any standard operators. As
with functions, the `end` keyword tells `is` when the 'if' is finished.

```
when temperature > 28
  log 'Too hot!'
end
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


### Objects

Objects can contain more than one value, and so are declared differently to
plain values with the `object` keyword, then followed up with `property`
statements to add properties.

```
object car
car property num_wheels is 4
car property color is 'red'
```

Object values are accesses simply using the `.` operator.

```
log 'Car has {car.wheels} wheels'

value car_color is car.color
```


## Imports

Specific imports are available (such as `fetch` for web requests) by using the
`using` keyword.

```
using fetch
```

Using an unrecognised library will throw an error detailing which libraries are
available to use.


## Examples

> See the `examples` directory for more example scripts.


### Fibonacci sequence

```
task fibonacci gets input
  when input <= 1
    return input
  end

  // return fib(n-1) + fib(n-2);
  value n_minus_1 is input - 1
  value n_minus_2 is input - 2
  value result_1 is from fibonacci with n_minus_1
  value result_2 is from fibonacci with n_minus_2
  return result_1 + result_2
end

value result is from fibonacci with 9
log 'result: {result}'
```

```
result: 34
```

### Get the current time

```
using fetch

task main
  value body is from fetch with 'http://time.evrythng.com/time'

  // Convert string to object
  object json is body

  log 'The time is {json.timestamp}'
end

run main
```


## TODO List

* Utilities (date/time, random numbers, read/write files, etc.)
* Evaluate function calls inline (multiple passes)
* Multiline test (e.g: to test object from variable)