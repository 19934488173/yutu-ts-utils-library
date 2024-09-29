export declare const debounce: <F extends (...args: any[]) => void>(func: F, wait?: number, immediate?: boolean) => (this: ThisParameterType<F>, ...args: Parameters<F>) => void;
export declare const throttle: <F extends (...args: any[]) => void>(func: F, wait?: number) => (this: ThisParameterType<F>, ...args: Parameters<F>) => void;
