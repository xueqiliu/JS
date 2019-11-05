/* 
中心思想： 返回一个函数，函数里是回调函数的调用 要通过apply(this,参数数组)，递归调用
1. 返回一个函数， 函数里要return func.apply(this,[3,4,5])
2. 外部函数arguments 要重新赋值，以提供给内部函数使用， 内部函数arguments 要转成数组
3. if(参数长度< 形参长度){递归调用自身 call(作用域，参数1，参数2))} 这里应该是调用了一次，all此时=[3,4]
4. 如何求all？all 是函数传入的参数（递归调用时传入的是一个数组[3,4]）concat 内部参数（argumenst类数组转成数组）
 */
function createCurry(func, arrArgs) {
    var args = arguments;
    var arrArgs = arrArgs || [];
    return function () {
        var _args = Array.from(arguments);
        var all = arrArgs.concat(_args)
        if (all.length < func.length) {
            return args.callee.call(this, func, all);
        }
        return func.apply(this, all)
    }

}
var addCurry = createCurry(function (a, b, c) {
    return a + b + c
});
// console.log(addCurry(3,4,5))
console.log(addCurry(3)(4)(5))