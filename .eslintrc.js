module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 0,
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['multiline-block-like', 'class', 'function'],
        next: '*',
      },
    ],
    'lines-between-class-members': ['error', 'always'],
    'react-hooks/exhaustive-deps': 0,
  },
};
