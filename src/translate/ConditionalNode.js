'use strict';

exports.name = 'translate';
exports.path = 'expression.node.ConditionalNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes

  return function(translator = {}){
    if (translator === undefined)
      throw new Error('Translator is undefined.');

    // rename parts of ConditionalNode
    let clone = this.map((child, path, parent) => {
      return child.translate(translator);
    });

    // modify conditional node by "translator.conditionalType.larger"
    let condition = _removeParenthesis(this.condition);

    // search modifications for larger, and, etc
    let translatedType = translator.conditionalType && translator.conditionalType[condition.fn];

    if (typeof translatedType === 'string') {
      throw new Error('Translation by String is not supported for ConditionalNode.');
    } else if(typeof translatedType === 'function') {
      let translated = translatedType.call(clone, expression); // modify by function
      if (translated === undefined) {
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    } else {
      return clone; // modify nothing
    }
  };
};

/* remove parenthesis from top */
function _removeParenthesis(node) {
  if (node.type === 'ParenthesisNode') {
    return _removeParenthesis(node.content);
  } else {
    return node;
  }
}