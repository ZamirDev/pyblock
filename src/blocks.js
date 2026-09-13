import * as Blockly from 'blockly';
import { pythonGenerator, Order } from 'blockly/python';

export const BLOCK_COLOURS = {
  output: '#FF9F9F',
  logic: '#7FD8F7',
  loops: '#C9A9FF',
  math: '#A3E3A3',
  text: '#FFC974',
  lists: '#8FC1FF',
  tuples: '#FFA8D9',
  dicts: '#D9B48F',
};

Blockly.defineBlocksWithJsonArray([
  {
    type: 'pyb_tuple_create',
    message0: 'tuple ( %1 , %2 , %3 , %4 )',
    args0: [
      { type: 'input_value', name: 'ITEM0' },
      { type: 'input_value', name: 'ITEM1' },
      { type: 'input_value', name: 'ITEM2' },
      { type: 'input_value', name: 'ITEM3' },
    ],
    colour: BLOCK_COLOURS.tuples,
    tooltip: 'Make a tuple. Tuples are like lists, but they never change.',
    helpUrl: '',
    output: null,
  },
  {
    type: 'pyb_tuple_item',
    message0: 'item # %1 of tuple %2',
    args0: [
      { type: 'input_value', name: 'INDEX' },
      { type: 'input_value', name: 'TUPLE' },
    ],
    colour: BLOCK_COLOURS.tuples,
    tooltip: 'Grab one item from a tuple (counting from #1).',
    output: null,
  },
  {
    type: 'pyb_dict_create',
    message0:
      'dictionary { %1 : %2 , %3 : %4 , %5 : %6 }',
    args0: [
      { type: 'input_value', name: 'K0' },
      { type: 'input_value', name: 'V0' },
      { type: 'input_value', name: 'K1' },
      { type: 'input_value', name: 'V1' },
      { type: 'input_value', name: 'K2' },
      { type: 'input_value', name: 'V2' },
    ],
    inputsInline: true,
    colour: BLOCK_COLOURS.dicts,
    tooltip: 'Make a dictionary: pairs of a KEY and a VALUE, like a real-life address book.',
    output: null,
  },
  {
    type: 'pyb_dict_get',
    message0: 'value for key %1 in dict %2',
    args0: [
      { type: 'input_value', name: 'KEY' },
      { type: 'input_value', name: 'DICT' },
    ],
    colour: BLOCK_COLOURS.dicts,
    tooltip: 'Get the value stored under a key.',
    output: null,
  },
  {
    type: 'pyb_dict_has',
    message0: 'dict %1 has key %2 ?',
    args0: [
      { type: 'input_value', name: 'DICT' },
      { type: 'input_value', name: 'KEY' },
    ],
    colour: BLOCK_COLOURS.dicts,
    tooltip: 'True if the key exists in the dictionary.',
    output: 'Boolean',
  },
  {
    type: 'pyb_dict_length',
    message0: 'size of dict %1',
    args0: [{ type: 'input_value', name: 'DICT' }],
    colour: BLOCK_COLOURS.dicts,
    tooltip: 'How many key-value pairs are in the dictionary?',
    output: 'Number',
  },
  {
    type: 'pyb_friendly_error',
    message0: '🛟 help me — why is my code wrong?',
    colour: BLOCK_COLOURS.output,
    previousStatement: null,
    nextStatement: null,
    tooltip: 'Place this at the bottom, then press Run to find a gentle hint about errors.',
  },
  {
    type: 'pyb_input',
    message0: 'ask the user %1',
    args0: [
      { type: 'input_value', name: 'PROMPT', check: 'String' },
    ],
    colour: BLOCK_COLOURS.text,
    output: 'String',
    tooltip: 'Ask the user a question and remember their answer.',
  },
]);

pythonGenerator.forBlock['pyb_tuple_create'] = function (block, generator) {
  const items = [];
  for (let i = 0; i < 4; i++) {
    const code = generator.valueToCode(block, `ITEM${i}`, Order.ATOMIC);
    if (code) items.push(code);
  }
  if (items.length === 0) return '()';
  if (items.length === 1) return `(${items[0]},)`;
  return `(${items.join(', ')})`;
};

pythonGenerator.forBlock['pyb_tuple_item'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', Order.MEMBER);
  const tuple = generator.valueToCode(block, 'TUPLE', Order.MEMBER);
  return `(${tuple})[(${index}) - 1]`;
};

pythonGenerator.forBlock['pyb_dict_create'] = function (block, generator) {
  const pairs = [];
  for (let i = 0; i < 3; i++) {
    const v = generator.valueToCode(block, `V${i}`, Order.ATOMIC);
    if (!v) continue;
    const k = generator.valueToCode(block, `K${i}`, Order.ATOMIC);
    pairs.push(`${k}: ${v}`);
  }
  return `{${pairs.join(', ')}}`;
};

// 6 fields: K0 V0 K1 V1 K2 V2 — but valueToCode for K goes first? Blockly fills in order given in message0
pythonGenerator.forBlock['pyb_dict_get'] = function (block, generator) {
  const key = generator.valueToCode(block, 'KEY', Order.ATOMIC);
  const dict = generator.valueToCode(block, 'DICT', Order.MEMBER);
  return `${dict}[${key}]`;
};

pythonGenerator.forBlock['pyb_dict_has'] = function (block, generator) {
  const key = generator.valueToCode(block, 'KEY', Order.ATOMIC);
  const dict = generator.valueToCode(block, 'DICT', Order.MEMBER);
  return `(${key} in ${dict})`;
};

pythonGenerator.forBlock['pyb_dict_length'] = function (block, generator) {
  const dict = generator.valueToCode(block, 'DICT', Order.ATOMIC);
  return `len(${dict})`;
};

pythonGenerator.forBlock['pyb_friendly_error'] = function (block, generator) {
  generator.statementToCode(block, '_NOOP');
  return '';
};

pythonGenerator.forBlock['pyb_input'] = function (block, generator) {
  const prompt = generator.valueToCode(block, 'PROMPT', Order.ATOMIC) || "''";
  return `input(${prompt})`;
};

export function pythonFromWorkspace(workspace) {
  const code = pythonGenerator.workspaceToCode(workspace);
  const parts = code.split('\n').filter((line) => line.trim() !== '');
  return parts.join('\n');
}