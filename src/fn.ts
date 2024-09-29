// 清除定时器函数，适配 Node.js 和浏览器
const clearTimer = (timer: ReturnType<typeof setTimeout> | null): null => {
  if (timer) clearTimeout(timer); // 如果存在定时器，清除
  return null;
};

// 防抖函数
export const debounce = <F extends (...args: any[]) => void>(
  func: F,
  wait: number = 300,
  immediate: boolean = false
) => {
  if (typeof func !== "function") throw new TypeError("Expected a function");

  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const callNow = immediate && !timer; // 判断是否立即执行
    timer = clearTimer(timer); // 清除定时器

    // 设置新的定时器
    timer = setTimeout(() => {
      if (!immediate) func.apply(this, args); // 延迟执行函数
      timer = clearTimer(timer); // 清除定时器
    }, wait);

    if (callNow) func.apply(this, args); // 立即执行函数
  };
};

// 节流函数
export const throttle = <F extends (...args: any[]) => void>(
  func: F,
  wait: number = 300
) => {
  if (typeof func !== "function") throw new TypeError("Expected a function");

  let timer: ReturnType<typeof setTimeout> | null = null;
  //上一次执行的时间
  let previous = 0;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const now = Date.now();
    // 计算剩余时间
    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      func.apply(this, args);
      previous = now;
      timer = clearTimer(timer);
    } else if (!timer) {
      // 如果没有定时器，设置定时器
      timer = setTimeout(() => {
        func.apply(this, args);
        previous = Date.now();
        timer = clearTimer(timer);
      }, remaining);
    }
  };
};
