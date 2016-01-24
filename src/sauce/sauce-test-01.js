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


// Node must be a function
typeof Node === 'function'

// Node must return a value
Node() !== undefined

// return value must have a key named value
Node().hasOwnProperty('value')

// key value must be equal to the given argument
Node('pouet').value === 'pouet'
Node('youpi').value === 'youpi'
Node(Node('pouet')).value.value === 'pouet'
