/*
     __                 _         _       __                      
    / /  __ _ _ __ ___ | |__   __| | __ _/ _\ __ _ _   _  ___ ___ 
   / /  / _` | '_ ` _ \| '_ \ / _` |/ _` \ \ / _` | | | |/ __/ _ \
  / /__| (_| | | | | | | |_) | (_| | (_| |\ \ (_| | |_| | (_|  __/
  \____/\__,_|_| |_| |_|_.__/ \__,_|\__,_\__/\__,_|\__,_|\___\___|

           .--,--.
           `.  ,.'
            |___|
            :o o:   O    La recette du succès, à la sauce curry !
           _`~^~'_  |    
         /'   ^   `\=)
       .'  _______ '~|
       `(<=|     |= /'
           |     |
           |_____|
    ~~~~~~~ ===== ~~~~~~~~



*/

function until(fn, max, i) {
  while (++i < max) {
    if (fn(i) === false) return false
  }
  return true
}

function isPrime(n) {
  return until(i => !Boolean(i % n), Math.floor(Math.sqrt(n)), 0)
}

const getPrime = (prime => () => {
  const matchPrime = i => {
    if (isPrime(i)) {
      prime = i
      return false
    }
  }

  until(matchPrime, Infinity, prime + 1)

  return prime
})(0)


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
