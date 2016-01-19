const is = require('lib/is');
const each = require('lib/each');
const globalState = require('state');
const cuid = require('cuid');
const document = require('global/document');
const renderIframe = require('layout/youtube-iframe');

// https://developers.google.com/youtube/js_api_reference
const YouTubeApiMethods = [
  'addEventListener',
  'clearVideo',
  'cuePlaylist',
  'cueVideoById',
  'cueVideoByUrl',
  'getAvailablePlaybackRates',
  'getAvailableQualityLevels',
  'getCurrentTime',
  'getDuration',
  'getOption',
  'getOptions',
  'getPlaybackQuality',
  'getPlaybackRate',
  'getPlayerState',
  'getPlaylist',
  'getPlaylistIndex',
  'getVideoBytesLoaded',
  'getVideoBytesTotal',
  'getVideoEmbedCode',
  'getVideoLoadedFraction',
  'getVideoStartBytes',
  'getVideoUrl',
  'getVolume',
  'isMuted',
  'loadPlaylist',
  'loadVideoById',
  'loadVideoByUrl',
  'mute',
  'nextVideo',
  'pauseVideo',
  'playVideo',
  'playVideoAt',
  'previousVideo',
  'removeEventListener',
  'seekTo',
  'setLoop',
  'setOption',
  'setPlaybackQuality',
  'setPlaybackRate',
  'setShuffle',
  'setVolume',
  'stopVideo',
  'unMute',
];

const video = () => {
  const id = cuid();
  let iframe;
  let virtualIframe;
  let videoId = -1;

  const ytApi = (func, args) => {
    if (!iframe) return;
    iframe.postMessage(JSON.stringify({
      event: 'command',
      func,
      args: args || '',
    }),'*');
  }

  const load = hash => {
    globalState.afterNextRender(() =>
      render.cueVideoById(hash));
  }

  const findIframe = () => {
    globalState.afterNextRender(() => {
      const elem = document.getElementById(id);
      if (!elem) return;

      iframe = elem.contentWindow;
    });
  } 

  const render = props => {
    if (is.str(props)) {
      props = { hash: props };
    }
    if (!iframe) {
      findIframe();
    } else if (props.hash && props.hash !== videoId) {
      load(props.hash);
    }

    if (props.hash) {
      videoId = props.hash;
      if (!virtualIframe) {
        props.id = id;
        virtualIframe = renderIframe(props);
      }
    }

    return renderIframe.wrapper(virtualIframe);
  }

  each(YouTubeApiMethods, method =>
    render[method] = (...args) => ytApi(method, args))

  return render;
}

module.exports = video;
