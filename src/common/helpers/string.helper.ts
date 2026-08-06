// ? ********************** Upper case first letter of a string ********************** */
export const uppercaseFirst = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

// ? ********************** Upper case each first letter of a string ********************** */
export const uppercaseWords = (value: string): string => {
  return value
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ? ********************** Singularize a word ********************** */
export const singularize = (word: string): string => {
  const endings: Record<string, string> = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: '',
  };

  return word.replace(
    new RegExp(`(${Object.keys(endings).join('|')})$`),
    (match) => endings[match],
  );
};
