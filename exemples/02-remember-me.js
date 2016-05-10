var encodeToBase64 = window.btoa

/* quick recap :
 * - I declare the variable encodeMe
 * - I set it to a function
 * - It concatenate the 2 arguments with a : between them
 * - It call the function encodeToBase64 with that new concatenated string
 * - It use implicit returns to return the new encoded value */
var encodeMe = (login, password) => encodeToBase64(login +':'+ password)


// Execise :
// Set your encoded login / password in the key 'user' in localStorage
// If you do not want to be remembered
