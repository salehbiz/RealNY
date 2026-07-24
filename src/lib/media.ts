const CDN = import.meta.env.VITE_MEDIA_CDN ?? '';
export const media = (path: string) => `${CDN}${path}`;
