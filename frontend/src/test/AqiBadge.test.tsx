import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AqiBadge } from '../components/common/AqiBadge';
import React from 'react';

describe('AqiBadge Component', () => {
  it('renders good AQI rating correctly', () => {
    render(<AqiBadge aqi={35} category="Good" />);
    expect(screen.getByText('35 AQI')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders hazardous AQI rating correctly', () => {
    render(<AqiBadge aqi={350} category="Hazardous" />);
    expect(screen.getByText('350 AQI')).toBeInTheDocument();
    expect(screen.getByText('Hazardous')).toBeInTheDocument();
  });
});
