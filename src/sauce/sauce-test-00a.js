// user.email must be a string
typeof user.email === 'string'

// user.email must contain an @ surrounded by characters
/.+@.+/.test(user.email)

