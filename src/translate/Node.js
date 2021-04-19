'use strict';

exports.name = 'translate';
exports.path = 'expression.node.Node.prototype';
exports.factory = function(){
  return function(translator){
    if (translator === undefined)
      throw new Error('Translator is undefined.');

    let clone = this.map((child, path, parent) => {
      return child.translate(translator);
    });

    return clone;
  };
};
