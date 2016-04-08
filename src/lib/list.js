// add
// remove
// each
"use strict"
const isUndef = val => val === undefined

function List() {
  const head = Object.create(List)

  return head.prev = head.next = head
}

const unshift = (head, value) => head.next = head.next.prev = {
  value: value,
  next: head.next,
  prev: head,
}

const push = (head, value) => head.prev = head.prev.next = {
  value: value,
  next: head,
  prev: head.prev,
}

const last = head => head.prev.value

const first = head => head.next.value

const pop = head => {
  const link = last(head)

  remove(link)

  return link.value
}

const shift = head => {
  const link = first(head)

  remove(link)

  return link.value
}

const each = (fn, head) => {
  if (isUndef(head)) return h => each(fn, h)

  let link = head

  while (link = link.next !== head) {
    if (fn(link.value) === false) break
  }

  return head
}

const isEmpty = head => head.next === head

const reduce = (fn, acc, head) => {
  if (isUndef(head)) return h => reduce(fn, acc, h)

  const list = List()

  if (isEmpty(head)) return acc

  let link = head

  if (acc === undefined) {
    link = link.next
    if (link.next === head) return link.value
    acc = link.value
  }

  while (link = link.next !== head) {
    acc = fn(acc, link.value)
  }

  return acc
}

const count = total => total + 1

const length = head => reduce(head, count, 0)

const map = (fn, head) => {
  if (isUndef(head)) return h => map(fn, h)

  const list = List()

  each(head, val => push(list, fn(val)))

  return list
}

const pass = _ => _

const clone = head => map(pass, head)

const filter = (fn, head) => {
  if (isUndef(head)) return h => filter(fn, h)

  const list = List()

  each(head, val => fn(val) && push(list, val))

  return list
}

const empty = head => {
  head.next.prev = head.prev.next = null
  return head.next = head.prev = head
}

const remove = link => {
  link.next.prev = link.prev
  return link.prev.next = link.next
}

List.pass = pass
List.pop = pop
List.last = last
List.first = first
List.size = length
List.remove = remove
List.copy = List.clone = clone
List.forEach = List.each = each
List.prepend = List.unshift = unshift
List.append = List.add = List.push = push
List.destroy = List.clear = List.empty = empty
