// ? ********************** Get the key for a month ********************** */
export const monthKey = (date: Date): string => {
  return date.toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  });
};

// ? ********************** Get the value for a month ********************** */
export const monthValue = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}`;
};

// ? ********************** Get the start and end dates for a month ********************** */
export const monthStartEnd = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { start, end };
};

// ? ********************** Get the months of a year up to the current month ********************** */
export const getMonthsOfYear = (year: number) => {
  const now = new Date();
  const currentMonth = now.getMonth();

  return Array.from({ length: currentMonth + 1 }, (_, i) => {
    const start = new Date(year, i, 1);
    const end = new Date(year, i + 1, 0);

    return {
      key: start.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      }),
      start,
      end,
    };
  });
};
