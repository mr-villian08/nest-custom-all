// ? ********************** Generate a random number of a specific length ********************** */
export const randomNumber = (length: number): number => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
  );
};
