import React from 'react';
import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage, useTranslations } from '../useLanguage';

const Consumer = () => {
  const { language, toggleLanguage, isEnglish, isBulgarian } = useLanguage();
  const { t } = useTranslations();

  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="is-english">{String(isEnglish)}</span>
      <span data-testid="is-bulgarian">{String(isBulgarian)}</span>
      <span data-testid="home-label">{t('home')}</span>
      <span data-testid="missing-key">{t('nonexistent')}</span>
      <button type="button" onClick={toggleLanguage}>
        toggle
      </button>
    </div>
  );
};

const OutsideConsumer = () => {
  useLanguage();
  return null;
};

describe('useLanguage hook and providers', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  it('initialises from storage, toggles, and exposes helpers', () => {
    localStorage.setItem('language', 'bg');

    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language').textContent).toBe('bg');
    expect(screen.getByTestId('home-label').textContent).toBe('Начало');
    expect(screen.getByTestId('missing-key').textContent).toBe('nonexistent');
    expect(screen.getByTestId('is-english').textContent).toBe('false');
    expect(screen.getByTestId('is-bulgarian').textContent).toBe('true');
    expect(document.documentElement.lang).toBe('bg');

    fireEvent.click(screen.getByText('toggle'));

    expect(screen.getByTestId('language').textContent).toBe('en');
    expect(screen.getByTestId('home-label').textContent).toBe('Home');
    expect(screen.getByTestId('is-english').textContent).toBe('true');
    expect(screen.getByTestId('is-bulgarian').textContent).toBe('false');
    expect(localStorage.getItem('language')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('throws when the hook is used outside of its provider', () => {
    expect(() => render(<OutsideConsumer />)).toThrow(
      /useLanguage must be used within a LanguageProvider/
    );
  });
});
