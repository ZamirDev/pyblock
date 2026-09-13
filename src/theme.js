import * as Blockly from 'blockly';
import { BLOCK_COLOURS } from './blocks.js';

export function buildClayTheme() {
  const blockStyles = {
    output_blocks: {
      colourPrimary: BLOCK_COLOURS.output,
      colourSecondary: '#ffd4d4',
      colourTertiary: '#7a3535',
    },
    logic_blocks: {
      colourPrimary: BLOCK_COLOURS.logic,
      colourSecondary: '#c4ecff',
      colourTertiary: '#2f6f8a',
    },
    loop_blocks: {
      colourPrimary: BLOCK_COLOURS.loops,
      colourSecondary: '#e5d6ff',
      colourTertiary: '#5a3f8a',
    },
    math_blocks: {
      colourPrimary: BLOCK_COLOURS.math,
      colourSecondary: '#d8f5d8',
      colourTertiary: '#3f7a3f',
    },
    text_blocks: {
      colourPrimary: BLOCK_COLOURS.text,
      colourSecondary: '#ffe6b8',
      colourTertiary: '#8a5f2f',
    },
    list_blocks: {
      colourPrimary: BLOCK_COLOURS.lists,
      colourSecondary: '#d4e7ff',
      colourTertiary: '#2f4f8a',
    },
    tuple_blocks: {
      colourPrimary: BLOCK_COLOURS.tuples,
      colourSecondary: '#ffd4ee',
      colourTertiary: '#8a2f6f',
    },
    dict_blocks: {
      colourPrimary: BLOCK_COLOURS.dicts,
      colourSecondary: '#ecdcc0',
      colourTertiary: '#6f4f2f',
    },
    variable_blocks: {
      colourPrimary: '#F5A75B',
      colourSecondary: '#FFE0BC',
      colourTertiary: '#8A5220',
    },
    variable_dynamic_blocks: {
      colourPrimary: '#F5A75B',
      colourSecondary: '#FFE0BC',
      colourTertiary: '#8A5220',
    },
    procedure_blocks: {
      colourPrimary: '#7F7FFF',
      colourSecondary: '#DCDCFF',
      colourTertiary: '#3F3F8A',
    },
  };

  Blockly.common.defineBlocksWithJsonArray([]); // ensure theme load order safe

  return Blockly.Theme.defineTheme('claydoodle', {
    name: 'claydoodle',
    base: Blockly.Themes.Classic,
    blockStyles,
    categoryStyles: {
      css_output: { colour: BLOCK_COLOURS.output },
      css_logic: { colour: BLOCK_COLOURS.logic },
      css_loops: { colour: BLOCK_COLOURS.loops },
      css_math: { colour: BLOCK_COLOURS.math },
      css_text: { colour: BLOCK_COLOURS.text },
      css_lists: { colour: BLOCK_COLOURS.lists },
      css_tuples: { colour: BLOCK_COLOURS.tuples },
      css_dicts: { colour: BLOCK_COLOURS.dicts },
      css_variables: { colour: '#F5A75B' },
      css_functions: { colour: '#7F7FFF' },
    },
    componentStyles: {
      workspaceBackgroundColour: '#FFF8EF',
      toolboxBackgroundColour: '#FFF1E0',
      toolboxForegroundColour: '#3D2C2E',
      flyoutBackgroundColour: '#FFF8EF',
      flyoutForegroundColour: '#3D2C2E',
      flyoutOpacity: 1,
      scrollbarColour: '#D8B08C',
      scrollbarOpacity: 0.8,
      insertionMarkerColour: '#FF6B6B',
      insertionMarkerOpacity: 0.5,
      markerColour: '#FF6B6B',
      cursorColour: '#FF6B6B',
    },
    fontStyle: {
      family: '"Baloo 2", "Fredoka", sans-serif',
      weight: 'bold',
      size: 13,
    },
  });
}