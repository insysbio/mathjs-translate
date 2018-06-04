'use strics';

const _ = require('lodash');

exports.name = 'julia';
exports.path = 'expression.translator.to';
exports.factory = function(){
  return {
    'functionName': {
      pow: function(expression){
        return new expression.node.OperatorNode('^', 'pow', this.args);
      },
      log: function(expression){
        if(this.args.length===1){
          return this;
        }else{
          this.args = [this.args[1], this.args[0]];
          return this;
        }
      }
    },
    'symbolName': {
      'PI': 'pi',
      'E': 'e',
    },
    'constant': function(expression){
      if(this.value===Infinity){
        return new expression.node.SymbolNode('Inf');
      }else{
        return this;
      }
    }
  };
};
