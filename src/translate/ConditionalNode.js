'use strict';

const _ = require('../lodash');

exports.name = 'translate';
exports.path = 'expression.node.ConditionalNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes
  return function(translator){
    if(translator===undefined)
      throw new Error('Translator is undefined.');
    let translatedType = _.get(translator, 'conditionalType.' + this.condition.content.fn);
    let clone = _.cloneDeep(this);

    if(typeof translatedType==='string'){
      throw new Error('Translation by String is not supported for ConditionalNode.');
    }else if(typeof translatedType==='function'){
      let translated = translatedType.call(clone, expression);
      if(translated===undefined){
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    }else{
      return clone;
    }
  };
};
