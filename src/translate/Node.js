'use strict';

const _ = require('../lodash');

exports.name = 'translate';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(translator){
    if(translator===undefined)
      throw new Error('Translator is undefined.');
    let clone = _.cloneDeepWith(this, (value, key) => {
      if(key==='args'){ // for arguments translation
        return value.map((arg) => arg.translate(translator));
      }else if(key==='content'){ // for bracket translation
        return value.translate(translator);
      }
    });

    return clone;
  };
};
