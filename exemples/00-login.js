/*
 * Instructions :
 * - Open your browser console and call the function git.login like so :
 *     git.login('username', 'password')
 *       -- Signup here https://github.com/join
 *
 *     git.login('ebfc2f58210d28a8dc35b38a54222c2c77c1da40')
 *       -- OAuth Token
 *       -- Make yours here https://github.com/settings/tokens/new
 *       -- Need Public repo access
 *
 *     git.login('username')
 *       -- will prompt for password so it's not in the console history
 *
 * -- To load next exercise, call the function next.
 * -- You can call next and skip any exercise use prev to go back
 * -- You don't need to be login, it's only for saving progress.
 *    Also note that github limit unauthenticated api calls to 60 per hour
 *
 *
 * All API calls are in HTTPS so your password is not vulnerable.
 * If you still feel uneasy, you can make a trash account just for this.
 *
 * Once you are login, your credentials are stored in the localStorage.
 *
 * To be forgoten simply clear the localStorage :
 * -- git.logout() (call git.logout.toString() to see what does the function)
 * -- localStorage.clear() (will remove your local progress, git.commit() first)
 *
 * You can check all the api calls I do here :
 * -> https://github.com/kigiri/learn/blob/master/src/helper/github.js#L35
 */
 