const ratio = 16 / 9

const clampWidth = (height, width) => {
  if ((width / ratio) > (height - 76)) {
    return (height - 76) * ratio
  }
  return width
}

const calcWidth = state => {
  if (state.videoDisplay === 'fullscreen') {
    return Math.floor(clampWidth(state.viewHeight, state.viewWidth))
  }
  return Math.floor(clampWidth(state.viewHeight, state.split * state.viewWidth))
}

module.exports = calcWidth
