
const { createClient } = require("oicq")
const account = require("../manifest").QUID
const client = createClient(account)
const fs = require("fs");
var admin_list = {};
var group_list = {};

var adminUpdater = function() { fs.readFileSync("./__QQBOT/admin-list.txt",function(err, data){ 
  console.log("admin_list 已更新")
  admin_list = data.toString().split("\n");
  console.log(admin_list)
})}
var groupUpdater = function () {fs.readFileSync("./__QQBOT/controlled-group.txt",function(err, data){ 
  console.log("group_list 已更新")
  group_list = data.toString().split("\n");
  console.log(group_list)
})}
setInterval(adminUpdater,1000 * 60);
setInterval(groupUpdater,1000 * 60 * 5);

client.on("system.online", () => console.log("Logged in!"))
client.on("message", e => {
  adminUpdater();
  groupUpdater();
  //合法性检查
  
  console.log(admin_list)
  e.reply("hello world", true) //true表示引用对方的消息
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = client;