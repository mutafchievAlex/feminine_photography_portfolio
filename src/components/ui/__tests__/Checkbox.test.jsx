import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Checkbox, CheckboxGroup } from '../Checkbox';

vi.mock('lucide-react', () => ({
  __esModule: true,
  Check: (props) => <svg data-testid="check-icon" {...props} />,
  Minus: (props) => <svg data-testid="minus-icon" {...props} />,
}));

describe('Checkbox', () => {
  it('renders with label, description, and required indicator', () => {
    render(
      <Checkbox
        checked
        label="Accept"
        description="Terms"
        required
      />
    );

    expect(screen.getByLabelText(/Accept/)).toBeChecked();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('*', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('shows the indeterminate state icon when specified', () => {
    render(<Checkbox label="Maybe" indeterminate />);

    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
  });
});

describe('CheckboxGroup', () => {
  it('renders a group with validation messaging', () => {
    render(
      <CheckboxGroup label="Options" error="Required">
        <Checkbox label="One" />
        <Checkbox label="Two" />
      </CheckboxGroup>
    );

    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
