export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  extensionsToTreatAsEsm: ['.jsx'],
  transformIgnorePatterns: ['node_modules/(?!lucide-react)'],

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!**/node_modules/**"
  ],
  coverageDirectory: "coverage",
};







// export default {
//   testEnvironment: 'jest-environment-jsdom',
//   setupFiles: ['<rootDir>/jest.setup.js'], // 👈 Add this line
//   transform: {
//     '^.+\\.(js|jsx)$': 'babel-jest',
//   },
//   moduleNameMapper: {
//     '\\.(css|scss|sass)$': 'identity-obj-proxy',
//     '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
//   },
//   extensionsToTreatAsEsm: ['.jsx'],
//   transformIgnorePatterns: [
//     'node_modules/(?!lucide-react)'
//   ]
// };