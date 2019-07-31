import $ from 'jquery'

window.$ = window.jQuery = $;

let a = new Promise((resolve, reject) => {
  setTimeout(()=>{
    resolve('1');
  },1000)
});

a.then((res)=>{
  alert(res);
  console.log('babel-polyfill success');
});
