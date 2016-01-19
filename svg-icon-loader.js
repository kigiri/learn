


module.exports = function (content) {
  var callback = this.async();
  if (!callback) return someSyncOperation(content);
  someAsyncOperation(content, function (err, result) {
    if (err) return callback(err);
    callback(null, result);
  });
};
