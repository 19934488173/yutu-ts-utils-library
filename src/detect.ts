import { hasOwn, toString } from "./variable";

// 检测数据类型的通用方法:返回所属类型的字符串
export const toType = (obj: unknown): string => {
  const reg = /^\[object ([\w\W]+)\]$/;

  // 如果 obj 为 null 或 undefined，直接返回 'null' 或 'undefined'
  if (obj == null) return String(obj);

  // 使用正则表达式提取类型
  return typeof obj === "object" || typeof obj === "function"
    ? reg.exec(toString.call(obj))![1].toLowerCase()
    : typeof obj;
};

// 检测是否是普通函数
export const isFunction = (fn: unknown): boolean => {
  return (
    typeof fn === "function" &&
    typeof (fn as { nodeType?: unknown }).nodeType !== "number" &&
    typeof (fn as { item?: unknown }).item !== "function"
  );
};

// 检测是否是window对象
export const isWindow = (obj: unknown): boolean => {
  return obj != null && (obj as Window).window === obj;
};

// 检测是否是数组或者类数组
export const isArrayLike = (obj: unknown): boolean => {
  // 1. 检查 obj 是否不为 null 或 undefined，并且是否有 length 属性
  const hasLength =
    obj != null && typeof (obj as { length: unknown }).length !== "undefined";
  if (!hasLength) return false;

  // 2. 获取 length 属性的值
  const length = (obj as { length: unknown }).length;

  // 3. 使用自定义函数 toType 来确定对象的类型
  const type = toType(obj);

  // 4. 如果 obj 是函数或 window 对象，则返回 false
  if (isFunction(obj) || isWindow(obj)) return false;

  // 5. 确定 obj 是否符合类数组的特征
  return (
    type === "array" ||
    length === 0 ||
    (typeof length === "number" &&
      length > 0 &&
      length - 1 in (obj as unknown[]))
  );
};

// 检测是否为“纯粹对象/标准普通”对象:obj.__proto__===Object.prototype
export const isPlainObject = (obj: unknown): boolean => {
  let proto, Ctor;
  if (!obj || toType(obj) !== "object") return false; // 检查 obj 是否为对象
  proto = Object.getPrototypeOf(obj); // 获取 obj 的原型
  if (!proto) return true; // 如果 obj 没有原型，匹配 Object.create(null) 则它是一个纯粹的对象
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor; // 获取原型上的构造函数
  return typeof Ctor === "function" && Ctor === Object; // 检查构造函数是否为 Object，如果是，则 obj 是一个纯粹的对象
};

// 检测是否为空对象
export const isEmptyObject = (obj: unknown): boolean => {
  // 如果 obj 不是对象类型或是 null，直接返回 false
  if (typeof obj !== "object" || obj === null) return false;
  // 获取对象的自身属性名称和符号属性
  const keys = Reflect.ownKeys(obj);
  // 如果属性数组长度为 0，表示对象为空
  return keys.length === 0;
};

// 检测是否为有效数字:支持数字字符串
export const isValidNumber = (value: unknown): boolean => {
  // 如果是 number 类型并且不是 NaN，直接返回 true
  if (typeof value === "number" && !isNaN(value)) return true;

  // 如果是字符串，尝试解析为浮点数
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    // 检查解析的结果是否为有效的数字
    return !isNaN(parsed);
  }

  // 其他类型都不是有效的数字
  return false;
};
