export const debounce = <A extends unknown[], R>(
  func: (...args: A) => R,
  delay: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: A): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
};
