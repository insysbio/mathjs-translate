'use strict';

exports.name = 'translate';
exports.path = 'expression.node.OperatorNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes

  return function(translator){
    if (translator === undefined)
      throw new Error('Translator is undefined.');

    let clone = this.map((child, path, parent) => {
      return child.translate(translator);
    });

    let translatedName = translator.operatorName && translator.operatorName[this.fn];
    if (typeof translatedName === 'string') {
      clone.fn.name = translatedName; // modify by rename
      return clone;
    } else if (typeof translatedName === 'function') {
      let translated = translatedName.call(clone, expression); // modify by function
      if (translated === undefined){
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    } else {
      return clone; // modify nothing
    }
  };
};
