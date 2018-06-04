'use strict';

const _ = require('lodash');

exports.name = 'translate';
exports.path = 'expression.node.FunctionNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes

  return function(translator){
    if(translator===undefined)
      throw new Error('Translator is undefined.');
    let translatedName = _.get(translator, 'functionName.' + this.fn.name)
    let clone =  _.cloneDeepWith(this, (value, key) => {
      if(key==='args'){
        return value.map((arg) => arg.translate(translator));
      }
    });

    if(typeof translatedName==='string'){
      clone.fn.name = translatedName;
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
