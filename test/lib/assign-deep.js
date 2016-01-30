module.exports = (test, assignDeep) => {
  const base = {
    a: {
      b: {
        c: 'lol'
      }
    }
  }

  const copy = assignDeep({}, base)

  test('assign-deep must return a new object', assert => {
    assert.notEqual(copy, base)
    assert.end()
  })

  test('assign-deep must return copies of nested objects', assert => {
    assert.notEqual(copy.a, base.a)
    assert.end()
  })

  test('assign-deep must copies the values', assert => {
    assert.equal(copy.a.b.c, base.a.b.c)
    assert.end()
  })

  test('assign-deep changes must not affect copies', assert => {
    base.a.b.c = 'pouet'
    assert.notEqual(copy.a.b.c, base.a.b.c)
    assert.end()
  })
}
