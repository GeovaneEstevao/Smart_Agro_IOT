import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    render(<LoginScreen />);
  });
});

