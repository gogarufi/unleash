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

export function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return h;
};
