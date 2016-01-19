const is = require('lib/is');

if (is.str('home')) {
  console.log('homeies');
}

module.exports = {
  load: observables => {
    observables.videoId.set('XEmnw7IxkSY');
  },
  render: pouet => {
    return 'yo'
  }
}


