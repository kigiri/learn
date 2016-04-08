module.exports = (test, section) => {
  const s1 = section.add('right')
  const s2 = section.add('')

  s1.add('lo')
  s1.add('lo')
  s1.del('lo')

  const sub = s1.sub

  test.true('i must make a section')
    (!!s1)

  test.true('my section haz a get that return an array')
    (Array.isArray(sub))

  test.equal('i can add stuf in it')
    ('yo', section.sub[0])

  test.equal('i can remove stuff')
    (1, section.sub.length)
}
