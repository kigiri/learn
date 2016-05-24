/*
 * Instructions :
 * - Open your console and call the function git.login like so :
 *     git.login('username', 'password')
 *     git.login('ebfc2f58210d28a8dc35b38a54222c2c77c1da40')
 *       -- OAuth Token
 *       -- Make yours here https://github.com/settings/tokens/new
 *       -- Need Public repo access
 *
 *     git.login('username')
 *       -- will prompt for password so it's not in the console history
 *
 * - To load next exercise, call the function next.
 * - You can call next and skip any exercise use prev to go back
 * - You don't need to be login, it's only for saving progress.
 *   Also note that github limit unauthenticated api calls to 60 per hour
 *
 * Once you are login, your credentials are stored in the localStorage.
 *
 * To be forgoten simply clear the localStorage :
 * -- git.logout() (call git.logout.toString() to see what does the function)
 * -- localStorage.clear() (will remove your local progress, git.commit() first)
 *
 */
 