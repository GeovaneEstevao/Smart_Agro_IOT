import React from 'react';
import { render } from '@testing-library/react-native';
import DashboardScreen from '../screens/DashboardScreen';

describe('DashboardScreen', () => {
  it('renders correctly', () => {
    render(<DashboardScreen />);
  });
});

