const h = require('lib/h')
const map = require('lib/collection/map')
const each = require('lib/collection/each')
const cook = require('sauce/cook-ascii.txt').split('o')
const greet = require('helper/greet')

require('./the-cook.css')

const upperPart = cook[0]
const lowerPart = cook[2]

const leftPadding = '                       '


const bubbleTop =  '\n\n\n\n\n\n'+ leftPadding
                     +'.--------------------------.\n'
const bubbleMiddle = '|                           |'
const bubbleLast =   '<                           |\n'
     + leftPadding +' \\__________________________|'

const centerStr = (src, str) => {
  const padding = Math.floor((src.length - str.length) / 2)
  return src.slice(0, padding) + str + src.slice(padding + str.length)
}

const centerEach = map((sentence, idx, all) => {
  const base = (idx === all.length - 1) ? bubbleLast : bubbleMiddle
  return leftPadding + centerStr(base, sentence)
})

const asciiBubble = sentences => bubbleTop
  + centerEach(sentences).join('\n')

const bubble = h.curry('#speach-bubble')

const speach = message => {
  const words = (message || greet()).split(' ').filter(Boolean)
  const sentences = []

  let currentSentence = words[0]
  each(word => {
    if (word.length + currentSentence.length < 25) {
      currentSentence += ' '+ word
    } else {
      sentences.push(currentSentence)
      currentSentence = word
    }
  }, words.slice(1))
  sentences.push(currentSentence)

  if (sentences.length < 2) {
    sentences.unshift('')
  }

  if (sentences.length < 3) {
    sentences.push('')
  }
  return bubble(asciiBubble(sentences))
}

const eyes = h.curry('span')
const theCook = h.curry('#the-cook.noselect')

const render = props => {
  const eye = props.eye || 'o'
  return theCook([
    speach(props.message),
    upperPart,
    eyes({ className: 'eyes-'+ eye.charCodeAt(0) }, eye +' '+ eye),
    lowerPart,
  ])
}

module.exports = render
