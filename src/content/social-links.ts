import type { SocialLink } from './types';

const canonicalSocialLinks: SocialLink[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    url: 'https://t.me/ODaBEAUTY67',
  },
  {
    id: 'max',
    label: 'MAX',
    url: 'https://max.ru/u/f9LHodD0cOIr4yL7s62OCtJ3BdiKi48kTig1NkLU2dUBkMx21sBL02sRETs',
  },
  {
    id: 'vk',
    label: 'VK',
    url: 'https://vk.com/oda_beauty_salon',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/oda_beauty_salon?igsh=MTQxcWo2aDR2djc3Ng==',
  },
];

export const normalizeSocialLinks = (socials: SocialLink[]): SocialLink[] =>
  canonicalSocialLinks.map((fallback) => socials.find(({ id }) => id === fallback.id) ?? fallback);
