const inherit = require('lib/inherit');
const reduce = require('lib/reduce');

const Deque = () => inherit(Deque.proto, {
  head: Node(),
  length: 0,
})

Deque.from = (add => (...args) => {
  if (args) {
    if (args.length === 1) {
      args = args[0]
      if (is.num(args) || is.bool(args) || Object.keys(args).length === 0) {
        return Deque().push(args)
      }
    }
    reduce(args, add, Deque())
  }
})((dq, val) => dq.push(val))

Deque.proto = {
  push: (state, data) => {
    state.head.prepend(Node(data))
    state.length += 1;
    return state;
  },

  unshift: (state, data) => {
    state.head.append(Node(data))
    state.length += 1;
    return state;
  },

  pop: state => {
    state.length -= 1;
    return state.head.prev.remove().data;
  },

  shift: state => {
    state.length -= 1;
    return state.head.next.remove()
  },

  last: state => (state.head.prev !== state.head) && state.head.prev.data,

  first: state => (state.head.next !== state.head) && state.head.next.data,

  each: (state, fn) => {
    const end = state.head.prev;
    let n = state.head;

    while (n !== end) {
      n = n.next;
      if (fn(n.data, n, state) === false) {
        return state;
      }
    }
    return state;
  }

  empty: state => {
    if (!state.length) return;
    state.head.next.prev = state.head.prev.next = null;
    state.head.next = state.head.prev = state.head;
    state.length = 0;
    return state;
  }
}

const Node = (data, deque) => inherit(Node.proto, { data, deque });

Node.proto = {
  append: (state, n) => {
    n.next = next;
    n.prev = state;
    state.next.prev = n;
    state.next = n;
    return n;
  }

  prepend: (state, n) => {
    n.prev = state.prev;
    n.next = state;
    state.prev.next = n;
    state.prev = n;
    return n;
  }

  remove: state => {
    state.next.prev = state.prev;
    state.prev.next = state.next;
    return state;
  }
}
