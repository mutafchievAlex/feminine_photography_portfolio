import '../../test/setupDomEnvironment';

import React, { act } from 'react';
import { beforeEach, describe, expect, it, mock, vi } from 'bun:test';
import { createRoot } from 'react-dom/client';

mock.module('../../services/stories', () => ({
  fetchStories: vi.fn(),
}));
mock.module('../../services/gallery', () => ({
  fetchGallery: vi.fn(),
}));
mock.module('../../services/instagram', () => ({
  fetchInstagramFeed: vi.fn(),
}));
mock.module('../../services/packages', () => ({
  fetchPackages: vi.fn(),
}));

const { fetchStories } = await import('../../services/stories');
const { fetchGallery } = await import('../../services/gallery');
const { fetchInstagramFeed } = await import('../../services/instagram');
const { fetchPackages } = await import('../../services/packages');

const useStories = (await import('../useStories')).default;
const useGallery = (await import('../useGallery')).default;
const useInstagramFeed = (await import('../useInstagramFeed')).default;
const usePackages = (await import('../usePackages')).default;

const mountHook = async (useHook, initialOptions) => {
  const container = document.createElement('div');
  const root = createRoot(container);

  const Harness = ({ options }) => {
    useHook(options);
    return null;
  };

  await act(async () => {
    root.render(<Harness options={initialOptions} />);
  });

  return {
    rerender: async (nextOptions) => {
      await act(async () => {
        root.render(<Harness options={nextOptions} />);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
    },
  };
};

describe('useStories', () => {
  beforeEach(() => {
    fetchStories.mockReset();
    fetchStories.mockResolvedValue([]);
  });

  it('only refetches when a tracked option changes', async () => {
    const harness = await mountHook(useStories, {
      photographerId: 'one',
      limit: 3,
    });

    expect(fetchStories).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', limit: 3 });
    expect(fetchStories).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'two', limit: 3 });
    expect(fetchStories).toHaveBeenCalledTimes(2);

    await harness.rerender({ photographerId: 'two', limit: 5 });
    expect(fetchStories).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});

describe('useGallery', () => {
  beforeEach(() => {
    fetchGallery.mockReset();
    fetchGallery.mockResolvedValue([]);
  });

  it('avoids duplicate fetches for identical filters', async () => {
    const harness = await mountHook(useGallery, {
      photographerId: 'one',
      category: 'weddings',
      limit: 4,
    });

    expect(fetchGallery).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', category: 'weddings', limit: 4 });
    expect(fetchGallery).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', category: 'portraits', limit: 4 });
    expect(fetchGallery).toHaveBeenCalledTimes(2);

    await harness.rerender({ photographerId: 'one', category: 'portraits', limit: 6 });
    expect(fetchGallery).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});

describe('useInstagramFeed', () => {
  beforeEach(() => {
    fetchInstagramFeed.mockReset();
    fetchInstagramFeed.mockResolvedValue([]);
  });

  it('refetches only when instagram options change', async () => {
    const harness = await mountHook(useInstagramFeed, {
      photographerId: 'one',
      limit: 6,
    });

    expect(fetchInstagramFeed).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', limit: 6 });
    expect(fetchInstagramFeed).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', limit: 9 });
    expect(fetchInstagramFeed).toHaveBeenCalledTimes(2);

    await harness.rerender({ photographerId: 'two', limit: 9 });
    expect(fetchInstagramFeed).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});

describe('usePackages', () => {
  beforeEach(() => {
    fetchPackages.mockReset();
    fetchPackages.mockResolvedValue([]);
  });

  it('fetches packages once per distinct configuration', async () => {
    const harness = await mountHook(usePackages, {
      photographerId: 'one',
      limit: 2,
    });

    expect(fetchPackages).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', limit: 2 });
    expect(fetchPackages).toHaveBeenCalledTimes(1);

    await harness.rerender({ photographerId: 'one', limit: 3 });
    expect(fetchPackages).toHaveBeenCalledTimes(2);

    await harness.rerender({ photographerId: 'two', limit: 3 });
    expect(fetchPackages).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});
