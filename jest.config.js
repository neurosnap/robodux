module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'test.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  globals: {
    'ts-jest': {
      skipBabel: true,
    },
  },
};
