const document = require('global/document')
const window = require('global/window')

module.exports = el => {
  if (!el) return
  if (typeof el.select === "function") return el.select()
  const range = document.createRange()
  range.selectNodeContents(el)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}
