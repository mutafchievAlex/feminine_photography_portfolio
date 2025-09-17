import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollToTop from '../ScrollToTop';

describe('ScrollToTop', () => {
  it('scrolls to the top whenever the pathname changes', async () => {
    const scrollToSpy = vi.fn();
    const originalScrollTo = window.scrollTo;
    window.scrollTo = scrollToSpy;

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/initial']}>
        <ScrollToTop />
        <Routes>
          <Route path="/initial" element={<Link to="/next">Next</Link>} />
          <Route path="/next" element={<div>Next route</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(scrollToSpy).not.toHaveBeenCalled();

    await user.click(screen.getByText('Next'));

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

    window.scrollTo = originalScrollTo;
  });
});
