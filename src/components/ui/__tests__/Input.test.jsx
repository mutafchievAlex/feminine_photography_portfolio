import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
  it('renders a checkbox input when type is checkbox', () => {
    render(<Input type="checkbox" aria-label="opt-in" />);

    const checkbox = screen.getByRole('checkbox', { name: 'opt-in' });
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('renders a radio input when type is radio', () => {
    render(<Input type="radio" aria-label="choice" />);

    const radio = screen.getByRole('radio', { name: 'choice' });
    expect(radio).toHaveAttribute('type', 'radio');
  });

  it('renders label, description, and error states for text inputs', () => {
    render(
      <Input
        label="Email"
        description="We will not spam you"
        error="Required"
        required
      />
    );

    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByText('We will not spam you')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
