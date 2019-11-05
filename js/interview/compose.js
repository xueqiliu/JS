function add(x){
    return (x+1);
}
function multiply(x){
    return (x*2)
}
function reduce(x){
    return (x-7);
}
function compose(){  // 函数式编程之合成
    var args = arguments;//闭包重新定义一个变量
    var start = arguments.length -1; //闭包
    return function(){
        var i = 0;
        var result = arguments[0];
        while(i<= start){
            result = args[i].call(this,result)
            i++;
        }
        return result;
    }
}
var composeFn = compose(add,multiply,reduce)
console.log(composeFn(14));