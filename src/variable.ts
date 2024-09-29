export const class2type: { [key: string]: string } = {};
//Object.prototype.toString  检测数据类型
export const toString: (obj?: any) => string = class2type.toString;
//Object.prototype.hasOwnProperty 检测是否为私有属性
export const hasOwn: (prop: string) => boolean = class2type.hasOwnProperty;
