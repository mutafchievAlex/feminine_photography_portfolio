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
mock.module('../../services/addOnServices', () => ({
  fetchAddOnServices: vi.fn(),
}));
mock.module('../../services/testimonials', () => ({
  fetchTestimonials: vi.fn(),
}));

const { fetchStories } = await import('../../services/stories');
const { fetchGallery } = await import('../../services/gallery');
const { fetchInstagramFeed } = await import('../../services/instagram');
const { fetchPackages } = await import('../../services/packages');
const { fetchAddOnServices } = await import('../../services/addOnServices');
const { fetchTestimonials } = await import('../../services/testimonials');

const useStories = (await import('../useStories')).default;
const useGallery = (await import('../useGallery')).default;
const useInstagramFeed = (await import('../useInstagramFeed')).default;
const usePackages = (await import('../usePackages')).default;
const useAddOnServices = (await import('../useAddOnServices')).default;
const useTestimonials = (await import('../useTestimonials')).default;

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
    const initialOptions = {
      photographerId: 'one',
      limit: 3,
    };

    const harness = await mountHook(useStories, initialOptions);

    expect(fetchStories).toHaveBeenCalledTimes(1);

    await harness.rerender(initialOptions);
    expect(fetchStories).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions });
    expect(fetchStories).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions, photographerId: 'two' });
    expect(fetchStories).toHaveBeenCalledTimes(2);

    await harness.rerender({ ...initialOptions, photographerId: 'two', limit: 5 });
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
    const initialOptions = {
      photographerId: 'one',
      category: 'weddings',
      limit: 4,
    };

    const harness = await mountHook(useGallery, initialOptions);

    expect(fetchGallery).toHaveBeenCalledTimes(1);

    await harness.rerender(initialOptions);
    expect(fetchGallery).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions });
    expect(fetchGallery).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions, category: 'portraits' });
    expect(fetchGallery).toHaveBeenCalledTimes(2);

    await harness.rerender({ ...initialOptions, category: 'portraits', limit: 6 });
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
    const initialOptions = {
      photographerId: 'one',
      limit: 6,
    };

    const harness = await mountHook(useInstagramFeed, initialOptions);

    expect(fetchInstagramFeed).toHaveBeenCalledTimes(1);

    await harness.rerender(initialOptions);
    expect(fetchInstagramFeed).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions });
    expect(fetchInstagramFeed).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions, limit: 9 });
    expect(fetchInstagramFeed).toHaveBeenCalledTimes(2);

    await harness.rerender({ ...initialOptions, photographerId: 'two', limit: 9 });
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
    const initialOptions = {
      photographerId: 'one',
      limit: 2,
    };

    const harness = await mountHook(usePackages, initialOptions);

    expect(fetchPackages).toHaveBeenCalledTimes(1);

    await harness.rerender(initialOptions);
    expect(fetchPackages).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions });
    expect(fetchPackages).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions, limit: 3 });
    expect(fetchPackages).toHaveBeenCalledTimes(2);

    await harness.rerender({ ...initialOptions, photographerId: 'two', limit: 3 });
    expect(fetchPackages).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});

describe('useAddOnServices', () => {
  beforeEach(() => {
    fetchAddOnServices.mockReset();
    fetchAddOnServices.mockResolvedValue([]);
  });

  it('reuses previous results for identical options', async () => {
    const initialOptions = {
      photographerId: 'one',
      limit: 4,
    };

    const harness = await mountHook(useAddOnServices, initialOptions);

    expect(fetchAddOnServices).toHaveBeenCalledTimes(1);

    await harness.rerender(initialOptions);
    expect(fetchAddOnServices).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions });
    expect(fetchAddOnServices).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions, photographerId: 'two' });
    expect(fetchAddOnServices).toHaveBeenCalledTimes(2);

    await harness.rerender({ ...initialOptions, photographerId: 'two', limit: 6 });
    expect(fetchAddOnServices).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});

describe('useTestimonials', () => {
  beforeEach(() => {
    fetchTestimonials.mockReset();
    fetchTestimonials.mockResolvedValue([]);
  });

  it('only fetches testimonials when filter values change', async () => {
    const initialOptions = {
      photographerId: 'one',
      limit: 3,
    };

    const harness = await mountHook(useTestimonials, initialOptions);

    expect(fetchTestimonials).toHaveBeenCalledTimes(1);

    await harness.rerender(initialOptions);
    expect(fetchTestimonials).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions });
    expect(fetchTestimonials).toHaveBeenCalledTimes(1);

    await harness.rerender({ ...initialOptions, photographerId: 'two' });
    expect(fetchTestimonials).toHaveBeenCalledTimes(2);

    await harness.rerender({ ...initialOptions, photographerId: 'two', limit: 5 });
    expect(fetchTestimonials).toHaveBeenCalledTimes(3);

    harness.unmount();
  });
});
