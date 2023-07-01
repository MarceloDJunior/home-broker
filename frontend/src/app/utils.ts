export const isDev = process.env.NODE_ENV == 'development';

export const isHomeBrokerClosed = () => {
  if (isDev) return false;

  const currentDate = new Date();
  const closeDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    18,
    0,
    0,
  );

  return currentDate > closeDate;
};

export const fetcher = (url: string) =>
  fetch(url).then((response) => response.json());
