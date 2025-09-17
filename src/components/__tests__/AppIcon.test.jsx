import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  __esModule: true,
  Camera: (props) => <svg data-testid="camera-icon" {...props} />,
  HelpCircle: (props) => <svg data-testid="help-icon" {...props} />,
}));

import Icon from '../AppIcon';

describe('AppIcon', () => {
  it('renders the requested lucide icon when available', () => {
    render(<Icon name="Camera" size={32} className="text-primary" />);

    const icon = screen.getByTestId('camera-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-testid', 'camera-icon');
  });

  it('falls back to HelpCircle when an icon is not found', () => {
    render(<Icon name="Missing" />);

    expect(screen.getByTestId('help-icon')).toBeInTheDocument();
  });
});
