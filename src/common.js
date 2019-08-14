// import $ from 'jquery'
//
// window.$ = window.jQuery = $;
console.log($("body"));
// 测试注释
let a = new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve('1');
  },1000)
});

a.then((res)=>{
  console.log('babel-polyfill success');
});


