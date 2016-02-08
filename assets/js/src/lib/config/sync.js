// some nice features may be:
// - queue which prioritises tasks
// - retry for server timeouts

var bb = require('backbone');
var App = require('lib/config/application');
var idbSync = require('./idb/src/sync');
var ajaxSync = bb.sync;

module.exports = function(method, entity, options) {

  // wrap sync errors, kick to error modal
  var onError = options.error;
  options.error = function(){
    App.prototype._onError.apply(this, arguments);
    if(onError) {
      onError.apply(options.context, arguments);
    }
  };

  // idb
  if(!options.remote &&
    (entity.db || (entity.collection && entity.collection.db))){
    return idbSync.apply(this, [method, entity, options]);
  }

  // add headers, global data etc
  App.prototype._ajaxSetup( options );

  return ajaxSync.apply(this, [method, entity, options]);
};