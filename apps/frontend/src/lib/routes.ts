export const ROUTES = {
  HOME: '/',
  SHOW: '/show',
  MEDIA_DETAIL: (id: string) => `/show/${id}`,
} as const;
