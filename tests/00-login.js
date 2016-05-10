/*
 * Category 00 : Basics
 * Exercise 00 : Login
 *
 * This website is built upon the Github API.
 * All your progress is stored only on your Github repository,
 * so you NEED a Github account to store your progress.
 *
 * You can make one here for free if you don't already have it :
 * -> https://github.com/join
 *
 * All API calls are in HTTPS so your password is not vulnerable.
 * If you still feel uneasy, you can make a trash account just for this.
 *
 * You can check all the api calls I do here :
 * -> https://github.com/kigiri/learn/blob/master/src/helper/github.js#L35
 */

// user must be defined
isTrue(typeof user !== 'undefined')

// user.login must be a string
isTrue(typeof user.login === 'string')

// user.login must contain only alphanumeric characters or hyphens
isTrue(/^[A-Za-z0-9-]+$/.test(user.login))

// user.login must not start with a hypen
isFalse(/^-/.test(user.login))

// user.login must not end with a hypen
isFalse(/-$/.test(user.login))

// user.login must not have consecutive separators
isFalse(/-{2}/.test(user.login))

// user.password must be a string
isTrue(typeof user.password === 'string')

// user.password must be longer than 7
isTrue(user.password.length > 7)

// user.password must have at least a lowercase letter
isTrue(/[a-z]/.test(user.password))

// user.password must have at least a number
isTrue(/[0-9]/.test(user.password))

// All seem good, let's see what's Github think about it...
github.verifyUser(user)
