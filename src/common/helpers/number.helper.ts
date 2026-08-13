// ? **************************************** Parse the number ************************************ */
export const parseNumber = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};
