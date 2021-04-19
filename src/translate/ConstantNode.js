'use strict';

exports.name = 'translate';
exports.path = 'expression.node.ConstantNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes

  return function(translator = {}){
    let clone = this.clone();

    let translatedName = translator.constant;
    if (typeof translatedName === 'string'){
      throw new Error('Translation by String is not supported for ConstantNode.');
    } else if (typeof translatedName === 'function'){
      let translated = translatedName.call(clone, expression);
      if (translated === undefined){
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    } else {
      return clone;
    }
  };
};
