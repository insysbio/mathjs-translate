'use strict';

const _ = require('../lodash');

exports.name = 'translate';
exports.path = 'expression.node.ConditionalNode.prototype';
exports.math = true;
exports.factory = function(){
  const expression = arguments[4].expression; // collection of nodes

  return function(translator = {}){
    // rename parts of ConditionalNode
    let clone = _.cloneDeepWith(this, (value, key) => {
      if (['condition', 'trueExpr', 'falseExpr'].indexOf(key) !== -1){
        return value.translate(translator);
      }
    });

    // modify conditional node by "translator.conditionalType.larger"
    let condition = _removeParenthesis(this.condition);
    // search modifications for larger, and, etc
    let translatedType = _.get(translator, 'conditionalType.' + condition.fn);
    if (typeof translatedType === 'string') {
      throw new Error('Translation by String is not supported for ConditionalNode.');
    } else if(typeof translatedType === 'function') {
      let translated = translatedType.call(clone, expression);
      if (translated === undefined) {
        throw new Error('Translation by Function returns "undefined".');
      }
      return translated;
    } else {
      return clone;
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