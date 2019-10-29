var foo = {
    value: 'lxq',
    getName: function () {
        console.log(this.value)
        console.log(arguments)
    }
}
// var newGetValue = foo.getName.bind(foo,'ppp') //foo.getName 是被调函数，newGetValue 是bind返回的新函数
// newGetValue(2);  //新函数被调用
// bind调用的时候都发生了什么？？？？？
/* 1. foo.getName 是被调函数，newGetValue 是bind返回的新函数
2. foo.getName 函数和newGetValue函数， 函数体一模一样
3. newGetValue被调用时候，this= foo,也就是bind 的第一个参数， 不能被重写
4. newGetValue被调用时候，bind里 的参数会排在newGetValue 的前面
5. new newGetValue()的时候， this会被忽略，但是参数依旧可以传 */
// =========================编程思路================================================================
// 1. bind必须是函数调用并且 返回一个新函数 
// 2. bind 第一个参数表示上下文环境 ：传参context
// 3. bind 第二个参数： bind传递的参数 + 新函数传递的参数，concat一起
// 4. 利用apply 
// 5. 闭包，this指向重新赋值
// 6. new 构造的话，要this instanceod that 判断
// 7. 为了以防会修改原型链， 中间fn函数赋值 最后返回fbound函数

Function.prototype.myBind = function(context){
    if(typeof this !=='function'){
        throw Error(this)
    }
    var that = this;
    var args = [].slice.call(arguments,1)
    var fn = function(){}
    var fbound  = function(){
        var bindArgs = Array.from(arguments);
        that.apply(this instanceof that ? this : context,args.concat(bindArgs))
    }
    fn.prototype = this.prototype;
    fbound.prototype = new fn();
    return fbound;
}

var newGet = foo.getName.myBind(foo,'wrj');
newGet(2,3,34,23)