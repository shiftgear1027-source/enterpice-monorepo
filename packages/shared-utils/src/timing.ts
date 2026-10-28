// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => void;

export interface Cancelable {
  cancel: () => void;
}

export function debounce<F extends AnyFn>(
  fn: F,
  waitMs: number,
): ((...args: Parameters<F>) => void) & Cancelable {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<F>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };
  return debounced;
}

/** Leading + trailing throttle. */
export function throttle<F extends AnyFn>(
  fn: F,
  intervalMs: number,
): ((...args: Parameters<F>) => void) & Cancelable {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: Parameters<F> | undefined;

  const throttled = (...args: Parameters<F>) => {
    const remaining = intervalMs - (Date.now() - last);
    if (remaining <= 0) {
      last = Date.now();
      fn(...args);
      return;
    }
    pending = args;
    if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = undefined;
        if (pending) fn(...pending);
        pending = undefined;
      }, remaining);
    }
  };
  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    pending = undefined;
  };
  return throttled;
}
