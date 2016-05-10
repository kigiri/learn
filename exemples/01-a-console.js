/* Here the name addTwoArguments is completly arbitrary, try to be descriptive.
 * the arguments (a, b) name are also arbitrary too. */
var addTwoArguments = (a, b) => {
  return a + b // <--- I return the value of the addition of the 2 arguments
}

/* For very simple functions, you may ommit {} and the return statement
 * this function will return the substraction of arguments a and b */
var substractTwoArguments = (a, b) => a - b

// I now call my addTwoArguments function
var addResult = addTwoArguments('my mom', 'I love ')
var subResult = substractTwoArguments(30, 20)

/* the result will appear in the console
 * because I call the function log from the console object */
console.log(addResult, subResult) // <--- arguments given to the log function
/*   ^
 *   |
 * the console object */


/* Now, open your console to see the result.
 * You don't have any code to write here for this exercise
 * just play arround in your console then skip it :) */

