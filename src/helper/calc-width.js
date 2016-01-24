const ratio = 16 / 9

const clamp = (height, width) => ((width / ratio) > (height - 76))
  ? (height - 76) * ratio
  : width

const calcWidth = state => Math.floor(clamp(state.viewHeight,
  state.videoDisplay === 'fullscreen'
    ? state.viewWidth
    : state.split * state.viewWidth))

calcWidth.ratio = ratio

module.exports = calcWidth
