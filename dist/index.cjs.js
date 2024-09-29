'use strict';

var class2type = {};
//Object.prototype.toString  检测数据类型
var toString = class2type.toString;
//Object.prototype.hasOwnProperty 检测是否为私有属性
var hasOwn = class2type.hasOwnProperty;

// 检测数据类型的通用方法:返回所属类型的字符串
var toType = function (obj) {
    var reg = /^\[object ([\w\W]+)\]$/;
    // 如果 obj 为 null 或 undefined，直接返回 'null' 或 'undefined'
    if (obj == null)
        return String(obj);
    // 使用正则表达式提取类型
    return typeof obj === "object" || typeof obj === "function"
        ? reg.exec(toString.call(obj))[1].toLowerCase()
        : typeof obj;
};
// 检测是否是普通函数
var isFunction = function (fn) {
    return (typeof fn === "function" &&
        typeof fn.nodeType !== "number" &&
        typeof fn.item !== "function");
};
// 检测是否是window对象
var isWindow = function (obj) {
    return obj != null && obj.window === obj;
};
// 检测是否是数组或者类数组
var isArrayLike = function (obj) {
    // 1. 检查 obj 是否不为 null 或 undefined，并且是否有 length 属性
    var hasLength = obj != null && typeof obj.length !== "undefined";
    if (!hasLength)
        return false;
    // 2. 获取 length 属性的值
    var length = obj.length;
    // 3. 使用自定义函数 toType 来确定对象的类型
    var type = toType(obj);
    // 4. 如果 obj 是函数或 window 对象，则返回 false
    if (isFunction(obj) || isWindow(obj))
        return false;
    // 5. 确定 obj 是否符合类数组的特征
    return (type === "array" ||
        length === 0 ||
        (typeof length === "number" &&
            length > 0 &&
            length - 1 in obj));
};
// 检测是否为“纯粹对象/标准普通”对象:obj.__proto__===Object.prototype
var isPlainObject = function (obj) {
    var proto, Ctor;
    if (!obj || toType(obj) !== "object")
        return false; // 检查 obj 是否为对象
    proto = Object.getPrototypeOf(obj); // 获取 obj 的原型
    if (!proto)
        return true; // 如果 obj 没有原型，匹配 Object.create(null) 则它是一个纯粹的对象
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor; // 获取原型上的构造函数
    return typeof Ctor === "function" && Ctor === Object; // 检查构造函数是否为 Object，如果是，则 obj 是一个纯粹的对象
};
// 检测是否为空对象
var isEmptyObject = function (obj) {
    // 如果 obj 不是对象类型或是 null，直接返回 false
    if (typeof obj !== "object" || obj === null)
        return false;
    // 获取对象的自身属性名称和符号属性
    var keys = Reflect.ownKeys(obj);
    // 如果属性数组长度为 0，表示对象为空
    return keys.length === 0;
};
// 检测是否为有效数字:支持数字字符串
var isValidNumber = function (value) {
    // 如果是 number 类型并且不是 NaN，直接返回 true
    if (typeof value === "number" && !isNaN(value))
        return true;
    // 如果是字符串，尝试解析为浮点数
    if (typeof value === "string") {
        var parsed = parseFloat(value);
        // 检查解析的结果是否为有效的数字
        return !isNaN(parsed);
    }
    // 其他类型都不是有效的数字
    return false;
};

// 清除定时器函数，适配 Node.js 和浏览器
var clearTimer = function (timer) {
    if (timer)
        clearTimeout(timer); // 如果存在定时器，清除
    return null;
};
// 防抖函数
var debounce = function (func, wait, immediate) {
    if (wait === void 0) { wait = 300; }
    if (immediate === void 0) { immediate = false; }
    if (typeof func !== "function")
        throw new TypeError("Expected a function");
    var timer = null;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callNow = immediate && !timer; // 判断是否立即执行
        timer = clearTimer(timer); // 清除定时器
        // 设置新的定时器
        timer = setTimeout(function () {
            if (!immediate)
                func.apply(_this, args); // 延迟执行函数
            timer = clearTimer(timer); // 清除定时器
        }, wait);
        if (callNow)
            func.apply(this, args); // 立即执行函数
    };
};
// 节流函数
var throttle = function (func, wait) {
    if (wait === void 0) { wait = 300; }
    if (typeof func !== "function")
        throw new TypeError("Expected a function");
    var timer = null;
    //上一次执行的时间
    var previous = 0;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        // 计算剩余时间
        var remaining = wait - (now - previous);
        if (remaining <= 0) {
            func.apply(this, args);
            previous = now;
            timer = clearTimer(timer);
        }
        else if (!timer) {
            // 如果没有定时器，设置定时器
            timer = setTimeout(function () {
                func.apply(_this, args);
                previous = Date.now();
                timer = clearTimer(timer);
            }, remaining);
        }
    };
};

exports.debounce = debounce;
exports.isArrayLike = isArrayLike;
exports.isEmptyObject = isEmptyObject;
exports.isFunction = isFunction;
exports.isPlainObject = isPlainObject;
exports.isValidNumber = isValidNumber;
exports.isWindow = isWindow;
exports.throttle = throttle;
exports.toType = toType;
//# sourceMappingURL=index.cjs.js.map
