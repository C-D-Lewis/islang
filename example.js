// compiled with is-compile.js

let counter = 0;
let maximum = 100;

counter = 10;

function increment(input) {
  return input + 1;
}

console.log(`Hello, world!`);

function main() {
  while(counter !== maximum) {
    increment(counter);
    console.log(`${counter}`);
  }
  console.log(`complete!`);
}

main();

