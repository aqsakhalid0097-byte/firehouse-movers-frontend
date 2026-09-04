import { BACKEND_URL } from '../api/axios';

/**
 * Resolves a media file path or profile picture URL to a fully qualified URL
 * pointing to the Django backend or static frontend assets.
 *
 * @param path The raw media path from API (e.g. '/media/profile_pictures/img.jpg' or 'http://...')
 * @returns Fully resolvable image URL string
 */
export function getMediaUrl(path?: string | null): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return '/images/user_icon.jpg';
  }

  const trimmed = path.trim();

  // Fully qualified URL (http:// or https://) or base64 data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Local frontend assets
  if (trimmed.startsWith('/images/') || trimmed.startsWith('/assets/')) {
    return trimmed;
  }

  const backendBase = (BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

  // Django media path starting with /media/
  if (trimmed.startsWith('/media/')) {
    return `${backendBase}${trimmed}`;
  }

  // Django media path starting with media/
  if (trimmed.startsWith('media/')) {
    return `${backendBase}/${trimmed}`;
  }

  // Relative path without media prefix (e.g. 'profile_pictures/img.jpg')
  return `${backendBase}/media/${trimmed.replace(/^\/+/, '')}`;
}

export default getMediaUrl;
