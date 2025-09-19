import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button component', () => {
  it('renders a standard button with children', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders loading and icon states correctly', () => {
    render(
      <Button iconName="Camera" loading>
        Loading
      </Button>
    );

    const button = screen.getByRole('button', { name: /Loading/ });
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeTruthy();
  });

  it('supports rendering custom elements when using asChild', () => {
    render(
      <Button asChild variant="outline" iconName="Camera" iconPosition="right">
        <a href="/demo" data-testid="child-link">
          Visit
        </a>
      </Button>
    );

    const link = screen.getByTestId('child-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/demo');
    expect(link.textContent).toContain('Visit');
    expect(link.querySelectorAll('svg').length).toBeGreaterThan(0);
  });

  it('falls back to a native button when asChild children are invalid', async () => {
    const user = userEvent.setup();

    render(
      <Button asChild loading fullWidth>
        Invalid text child
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Invalid text child' });
    expect(button).toBeDisabled();
    expect(button.className).toContain('w-full');

    await user.click(button);
    expect(button).toBeDisabled();
  });
});
