const h = require('lib/h')
const videoDisplay = require('state').observ.videoDisplay

const videoWrapper = h.curry('div', { className: 'video-wrapper'}).style
const iframe = h.curry('iframe', {
  style: {
    border: 'none',
    background: 'transparent'
  }
})

require('./youtube-iframe.css')

const render = props => {
  const query = []

  if (!props.showControls) {
    query.push('controls=1')
  }
  if (!props.showInfo) {
    query.push('showinfo=0')
  }
  if (props.autoPlay) {
    query.push('autoplay=1')
  }
  if (!props.disableApi) {
    query.push('enablejsapi=1')
  }
  if (!props.showRelated) {
    query.push('rel=0')
  }

  const src = 'https://www.youtube.com/embed/'+ props.hash
    +'?'+ query.join('&amp;') 

  const iframeProps = {
    src,
    id: props.id,
    width: props.width || 1280,
    height: props.height || 720,
  }

  if (props.preventFullScreen) {
    iframeProps.allowFullScreen = true
    iframeProps.webkitAllowFullScreen = true
    iframeProps.mozAllowFullScreen = true
  }

  return iframe(iframeProps)
}

render.wrapper = child => videoWrapper({
  paddingBottom: videoDisplay() === 'hide' ? 0 : ''
}, child)

module.exports = render
