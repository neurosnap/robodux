/**
 * Encode a string of text as base64
 *
 * @param data The string of text.
 * @returns The base64 encoded string.
 */
export function encodeBase64(data: string) {
  if (typeof btoa === 'function') {
    return btoa(data);
  } else if (typeof Buffer === 'function') {
    return Buffer.from(data, 'utf-8').toString('base64');
  } else {
    throw new Error('Failed to determine the platform specific encoder');
  }
}

/**
 * Decode a string of base64 as text
 *
 * @param data The string of base64 encoded text
 * @returns The decoded text.
 */
export function decodeBase64(data: string) {
  if (typeof atob === 'function') {
    return atob(data);
  } else if (typeof Buffer === 'function') {
    return Buffer.from(data, 'base64').toString('utf-8');
  } else {
    throw new Error('Failed to determine the platform specific decoder');
  }
}
