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

is("user.name a string")
  (typeof user.name === 'string')

is("user.name longer than 3")
  (user.name.length > 3)

is("user.name only alphanumeric characters or _, -, . separators")
  (/^[A-Za-z0-9_.-]+$/.test(user.name))

does.not("user.name start with a separator")
  (/^[_.-]/.test(user.name))

does.not("user.name end with a separator")
  (/[_.-]$/.test(user.name))

does.not("user.name have consecutive separators")
  (/[_.-]{2}/.test(user.name))

is("user.password a string")
  (typeof user.password === 'string')

is("user.password longer than 3")
  (user.password.length > 6)

does("user.password have at least a letter")
  (/[A-Za-z]/.test(user.password))

does("user.password have at least a number")
  (/[0-9]/.test(user.password))
