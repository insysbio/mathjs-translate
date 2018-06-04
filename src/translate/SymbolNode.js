'use strict';

const _ = require('../lodash');

exports.name = 'translate';
exports.path = 'expression.node.SymbolNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes

  return function(translator){
    if(translator===undefined)
      throw new Error('Translator is undefined.');
    let translatedName = _.get(translator, 'symbolName.' + this.name);
    let clone = _.cloneDeep(this);

    if(typeof translatedName==='string'){
      clone.name = translatedName;
      return clone;
    }else if(typeof translatedName==='function'){
      let translated = translatedName.call(clone, expression);
      if(translated===undefined){
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    }else{
      return clone;
    }
  };
};
