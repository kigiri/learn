/*
     __                 _         _       __                      
    / /  __ _ _ __ ___ | |__   __| | __ _/ _\ __ _ _   _  ___ ___ 
   / /  / _` | '_ ` _ \| '_ \ / _` |/ _` \ \ / _` | | | |/ __/ _ \
  / /__| (_| | | | | | | |_) | (_| | (_| |\ \ (_| | |_| | (_|  __/
  \____/\__,_|_| |_| |_|_.__/ \__,_|\__,_\__/\__,_|\__,_|\___\___|

           .--,--.
           `.  ,.'
            |___|
            :o o:   O    Are you ready for cookin' ?
           _`~^~'_  |    
         /'   ^   `\=)
       .'  _______ '~|
       `(<=|     |= /'
           |     |
           |_____|
    ~~~~~~~ ===== ~~~~~~~~



*/


// user.name must be a string
typeof user.name === 'string'

// user.name must be longueur than 3
user.name.length > 3

// user.name must contains only alphanumeric characters or _, -, . separators
/^[A-Za-z0-9_.-]+$/.test(user.name)

// user.name can not start with a separator
!/^[_.-]/.test(user.name)

// user.name can not end with a separator
!/[_.-]$/.test(user.name)

// user.name can not have consecutive separators
!/[_.-]{2}/.test(user.name)

// user.password must be a string
typeof user.password === 'string'

// user.password must be longueur than 3
user.password.length > 6

// user.password must have at least a letter
/[A-Za-z]/.test(user.password)

// user.password must have at least a number
/[0-9]/.test(user.password)
