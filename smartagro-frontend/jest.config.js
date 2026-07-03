module.exports = {
    preset: 'jest-expo',
    setupFiles: ['./jest.setup.js'],
    moduleNameMapper: {
      '^react-native/Libraries/Animated/NativeAnimatedHelper$': '<rootDir>/__mocks__/react-native/Libraries/Animated/NativeAnimatedHelper.js',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|unimodules-test-core|@unimodules/.*|sentry-expo|native-base|react-native-svg)',
    ],
  };
  