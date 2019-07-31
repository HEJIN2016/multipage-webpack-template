import axios from 'axios'
import "../style/a.less"
axios({
  url: "/"
}).then((res)=>{
  console.log(res);
});