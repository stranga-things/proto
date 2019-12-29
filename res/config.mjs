
export default {
    VIEWING_ANGLE: 30, // In degrees
    SCALE_FACTOR: 0.01,
    ASPECT_RATIO: 1,
    NEAR: 1e-6,
    FAR: 1e6,

    SPACE: / +/g,
    NUMBER: /\d+/,
    PRECISION: 2,
    SLICE_CHARACTER: ':',
    PARTIAL_SLICE: /\d*:\d*:*\d*/,
    ARRAY_REPLACER: '],\n$1[',
    ARRAY_SPACER: /\]\,(\s*)\[/g,
    PARSE_NUMBER: /\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g,

    SYMBOL_FROM_ID: {
        0: '',
        1: 'i',
        2: 'j',
        3: 'k'
    },
}
