
const { createClient } = require("oicq")
const account = require("../manifest").QUID
const client = createClient(account)
const fs = require("fs");
var admin_list = {};
var group_list = {};

var adminUpdater = function() {fs.readFile("./__QQBOT/admin-list.txt",function(err, data){ 
  if(err) return;
  console.log("admin_list 已更新")
  admin_list = data.toString().split("\n");
})
var groupUpdater = fs.readFile("./__QQBOT/controlled-group.txt",function(err, data){ 
  if(err) return;
  console.log("group_list 已更新")
  group_list = data.toString().split("\n");
})
setInterval(adminUpdater,1000 * 60);
setInterval(groupUpdater,1000 * 60 * 5);
adminUpdater();
groupUpdater();

client.on("system.online", () => console.log("Logged in!"))
client.on("message", e => {
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