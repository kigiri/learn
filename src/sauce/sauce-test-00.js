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
