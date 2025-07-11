import gravatarUrl from 'gravatar';

export function getGravatarUrl(email, size = 40) {
  return gravatarUrl.url(email || '', { s: size.toString(), d: 'identicon' });
} 