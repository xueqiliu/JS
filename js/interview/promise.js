const Pending = 'pending';
const Fulfilled = 'fulfilled';
const Rejected = 'rejected';

function myPromise(fn) {
    let self = this;
    self.status = Pending;
    self.onFulfilledCallback = [];
    self.onRejectedCallback = [];

    function resolve(value) {
        self.status = Fulfilled;
        self.value = value;
        self.onFulfilledCallback.forEach(fn => fn(self.value))

    }
    function reject(reason) {
        self.status = Rejected;
        self.reason = reason;
        self.onRejectedCallback.forEach(fn => fn(self.reason))
    }
    try {
        fn(resolve, reject)
    } catch (error) {
        reject(error)
    }
    myPromise.prototype.then = function (onFulfilled, onRejected) {
        typeof onFulfilled === 'function' ? onFulfilled : value => value;
        typeof onRejected === 'function' ? onRejected : reason => reason;
        let self = this;
        console.log(self)
        let promise2 = new myPromise(function (resolve, reject) {
            if (self.status == Fulfilled) {
                try {
                    setTimeout(() => {
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2, x, resolve, reject)
                    });
                } catch (error) {
                    reject(error)
                }
            }
            if (self.status == Rejected) {
                try {
                    setTimeout(() => {
                        let x = onRejected(self.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    });
                } catch (error) {
                    reject(error)
                }
            }
            if (self.status == Pending) {
                self.onFulfilledCallback.push(() =>
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(self.value);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }))
                self.onRejectedCallback.push(() =>
                    setTimeout(() => {
                        try {
                            let x = onRejected(self.reason);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }))
            }
        })
        return promise2;
    }
    // 成功时执行的函数
    function resolvePromise(promise2, x, resolve, reject) {
        // console.log('oooo:', x, typeof x, x instanceof myPromise)
        if (x === promise2) {
            reject(new TypeError('错误'))
        }
        let used = false; //避免被调用多次
        if (x instanceof myPromise) {
            if (x.status === Pending) {
                x.then(y => {
                    resolvePromise(promise2, x, resolve, reject)
                }, e => {
                    reject(e)
                });
            } else {
                x.then(resolve, reject) // !!!!!!
            }
        } else if (x != null && ((typeof x === 'function') || (typeof x === 'object'))) { //ok
            try {
                let then = x.then;
                if (typeof then === 'function') {
                    then.call(x, y => {
                        if (used) return
                        used = true;
                        resolvePromise(promise2, y, resolve, reject)
                    })
                } else {
                    resolve(x);
                }
            } catch (e) {
                if (used) return;
                used = true;
                reject(e)
            }
        } else {
            resolve(x)
        }
    }
}

let thenable = {
    then: function (resolve, reject) {
        resolve(42);
    }
};
const p1 = new myPromise(function (resolve, reject) {
    resolve(999)
})
const p2 = new myPromise(function (resolve, reject) {
    resolve(p1)
})
p2.then(res=>{
    console.log('结果：：：：',res)
    return res
}).then(res=>{
    console.log('最终结果：：：：',res)
})

// p1.then(res => {
//     return res
// }).then((res) => {
//     console.log('结果：', res)
// })