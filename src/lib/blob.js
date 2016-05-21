const window = require('global/window')
const constructor = window.BlobBuilder
  || window.WebKitBlobBuilder
  || window.MozBlobBuilder

module.exports = (response, type) => {
  try {
    return new Blob([response], { type });
  } catch (e) { // Backwards-compatibility
    var blob
    blob = new constructor()
    blob.append(response)
    return blob.getBlob()
  }
}
