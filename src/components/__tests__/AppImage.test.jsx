import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppImage from '../AppImage';

describe('AppImage', () => {
  it('uses the provided src and alt attributes', () => {
    render(<AppImage src="/example.jpg" alt="Example" />);

    const img = screen.getByRole('img', { name: 'Example' });
    expect(img).toHaveAttribute('src');
    expect(img).toHaveAttribute('alt', 'Example');
  });

  it('falls back to the placeholder image on error', () => {
    render(<AppImage src="/broken.jpg" alt="Broken" />);

    const img = screen.getByRole('img', { name: 'Broken' });
    fireEvent.error(img);

    expect(img.src).toContain('/assets/images/no_image.png');
  });
});
