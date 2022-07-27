
const { createClient } = require("oicq")
const account = require("../manifest").QUID
const client = createClient(account)
const fs = require("fs");
var admin_list = {};

setInterval(function() {
  fs.readFileSync("./admin-list.txt",function(err, data){ 
    if(err) throw err;
    admin_list = data.toString().split("\n");
  })
},1000 * 60);

client.on("system.online", () => console.log("Logged in!"))
client.on("message", e => {
  //合法性检查
  if(e.sender.user_id )
  console.log(e)
  e.reply("hello world", true) //true表示引用对方的消息
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = client;