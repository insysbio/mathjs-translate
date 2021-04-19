'use strict';

exports.name = 'translate';
exports.path = 'expression.node.FunctionNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // math.expression

  return function(translator){
    if (translator === undefined) 
      throw new Error('Translator is undefined.');

    // creates clone with translated children
    let clone = this.map((child, path, parent) => {
      return child.translate(translator);
    });

    // get function's new name
    let translatedName = translator.functionName && translator.functionName[this.fn.name];

    if (typeof translatedName === 'string') {
      clone.fn.name = translatedName; // modify only name
      return clone;
    } else if (typeof translatedName === 'function') {
      let translated = translatedName.call(clone, expression); // modify by function
      if (translated === undefined) {
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    } else {
      return clone; // modify nothing
    }
  };
};
