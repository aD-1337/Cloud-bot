
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
})}
var groupUpdater = function() {fs.readFile("./__QQBOT/controlled-group.txt",function(err, data){ 
  if(err) return;
  console.log("group_list 已更新")
  group_list = data.toString().split("\n");
})}
setInterval(adminUpdater,1000 * 30);setInterval(groupUpdater,1000 * 30);
adminUpdater();groupUpdater();

client.on("system.online", () => console.log("Logged in!"))
client.on("message.group", e => {
  //合法性检查
  if (e.message_type != "group") {console.log("this message isnt from a group");};
  if (e.message[0].type != "text") {console.log("this message isnt a text");};
  if (e.sub_type != 'normal') {console.log("this message are not normal");};
  if (e.post_type != 'message') {console.log("this message isnt a message");};
  if (e.block == true) {console.log("5");};
  if (e.atall == true) {console.log("6");};
  console.log(admin_list)

  if (admin_list[e.sender.user_id] == undefined) {console.log("7");};
  if (group_list[e.group_id] == undefined) {console.log("8");};
  for(i=admin_list.length;i>0;i--) {
    if (admin_list[i] == e.sender.user_id
  }
  e.reply("hello world", true) //true表示引用对方的消息
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = client;