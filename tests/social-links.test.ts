import { describe, expect, it } from 'vitest';
import { normalizeSocialLinks } from '../src/content/social-links';

describe('social link normalization', () => {
  it('adds Telegram and MAX while preserving current VK and Instagram links', () => {
    const socials = normalizeSocialLinks([
      { id: 'vk', label: 'VK', url: 'https://vk.com/custom' },
      { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/custom' },
    ]);

    expect(socials.map(({ id }) => id)).toEqual(['telegram', 'max', 'vk', 'instagram']);
    expect(socials.find(({ id }) => id === 'telegram')?.url).toBe('https://t.me/ODaBEAUTY67');
    expect(socials.find(({ id }) => id === 'max')?.url).toBe(
      'https://max.ru/u/f9LHodD0cOIr4yL7s62OCtJ3BdiKi48kTig1NkLU2dUBkMx21sBL02sRETs',
    );
    expect(socials.find(({ id }) => id === 'vk')?.url).toBe('https://vk.com/custom');
    expect(socials.find(({ id }) => id === 'instagram')?.url).toBe('https://instagram.com/custom');
  });

  it('removes WhatsApp and map entries from stale CMS content', () => {
    const socials = normalizeSocialLinks([
      { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/79156398988' },
      { id: 'map', label: 'Яндекс Карты', url: 'https://yandex.ru/maps/example' },
    ]);

    expect(socials.map(({ id }) => id)).toEqual(['telegram', 'max', 'vk', 'instagram']);
  });
});
