
const { createClient } = require("oicq")
const account = require("../manifest").QUID
const client = createClient(account)
const API = require("../__API/entrance");
const fs = require("fs");
var admin_list = "";
var group_list = "";
var adminUpdater = function() {fs.readFile("./__QQBOT/admin-list.txt",function(err, data){ 
  if(err) return;
  console.log("admin_list 已更新")
  admin_list = data.toString()
})}
var groupUpdater = function() {fs.readFile("./__QQBOT/controlled-group.txt",function(err, data){ 
  if(err) return;
  console.log("group_list 已更新")
  group_list = data.toString()
})}
setInterval(adminUpdater,1000 * 30);setInterval(groupUpdater,1000 * 30);
adminUpdater();groupUpdater();

client.on("system.online", () => console.log("Logged in!"))
client.on("message.group", e => {
  //合法性检查
  if (e.message_type != "group") return;
  if (e.message[0].type != "text") return;
  if (e.sub_type != 'normal') return;
  if (e.post_type != 'message') return;
  if (e.block == true) return;
  if (e.atall == true) return;
  if (group_list.match(e.group_id.toString())[0] != e.group_id.toString()) return;

  if (e.raw_message.split("")[0] != "!") return;
  if (e.raw_message != e.message[0].text) {e.reply("您的消息存在编码错误", true); return;}
  if (admin_list.match(e.user_id.toString())[0] != e.user_id.toString()) {e.reply("Access denied: You dont have permission to execute this command", true); return;}
  
  const parameters = e.raw_message.split(" ");

  switch(parameters[0]) {
    case "!allconfigs" :
      if(parameters.length != 1) {e.reply("参数格式不正确", true); return;};
      var string = "绑定账户拥有的所有参数：\n";
      API("GET", "configs").then(function(result) {
        if(JSON.parse(result).errors != undefined) {e.reply("ERROR: " + JSON.parse(result).errors[0].message, true);return;};
        for(i = 0; i < result.length - 1; i++) {
          if(JSON.parse(result).configs[i] == undefined) continue;
          let owned = JSON.parse(result).configs[i].user_id == require("../manifest").userID && '* ' || '';
          string += "----------------------------\n"
          string += "[" + owned + JSON.parse(result).configs[i].name.toString() + "] - " + JSON.parse(result).configs[i].config_id.toString() + "\n";
          string += "----------------------------\n"
          string += "* 表示您拥有此项目"
          e.reply(string, true)
        }
      });
    break;
    case "!allscripts" :
      if(parameters.length != 1) {e.reply("参数格式不正确", true); return;};
      var string = "绑定账户拥有的所有脚本：\n";
      API("GET", "scripts").then(function(result) {
        if(JSON.parse(result).errors != undefined) {e.reply("ERROR: " + JSON.parse(result).errors[0].message, true);return;};
        for(i = 0; i < result.length - 1; i++) {
          if(JSON.parse(result).scripts[i] == undefined) continue;
          let owned = JSON.parse(result).scripts[i].user_id == require("../manifest").userID && '* ' || '';
          string += "----------------------------\n"
          string += "[" + owned + JSON.parse(result).scripts[i].name.toString() + "] - " + JSON.parse(result).scripts[i].script_id.toString() + "\n";
          string += "----------------------------\n"
          string += "* 表示您拥有此项目"
          e.reply(string, true)
        }
      });
    break;

    case "!getconfiginfo" :
      if(parameters.length != 2 || !parameters[1].match(new RegExp('^[0-9]+$'))) {e.reply("参数格式不正确", true); return;};
      API("GET", "configs/" + encodeURI(parameters[1])).then(function(result) {
        console.log(JSON.parse(result))
        if(JSON.parse(result).errors != undefined) {e.reply("ERROR: " + JSON.parse(result).errors[0].message, true);return;};
        if(JSON.parse(result).config == undefined) {e.reply("ERROR: cannot resolve remote host package", true);return;};
        if(JSON.parse(result).config.user_id != require("../manifest").userID) {e.reply("ERROR: you're not owning this config", true);return;};
        var string = "配置 " + JSON.parse(result).config.name.toString() + " 的相关信息：\n";
        string += "创建于：" + new Date(JSON.parse(result).config.created * 1000).toLocaleString().replace(",",' ') + "\n"
        string += "最后更新于：" + new Date(JSON.parse(result).config.updated * 1000).toLocaleString().replace(",",' ') + "\n"
        string += "----------------------------\n"
        string += "所有订阅者:\n"
        for(i = 0; i < JSON.parse(result).config.subscriptions.length; i++) {
          string += "* [" + JSON.parse(result).config.subscriptions[i].status.toUpperCase() + "] - " + JSON.parse(result).config.subscriptions[i].user_id + "\n";
        }
        string += "----------------------------"
        e.reply(string, true)
      });
    break;
    case "!getscriptinfo" :
      if(parameters.length != 2 || !parameters[1].match(new RegExp('^[0-9]+$'))) {e.reply("参数格式不正确", true); return;};
      API("GET", "scripts/" + encodeURI(parameters[1])).then(function(result) {
        
        if(JSON.parse(result).errors != undefined) {e.reply("ERROR: " + JSON.parse(result).errors[0].message, true);return;};
        if(JSON.parse(result).script == undefined) {e.reply("ERROR: cannot resolve remote host package", true);return;};
        if(JSON.parse(result).script.user_id != require("../manifest").userID) {e.reply("ERROR: you're not owning this script", true);return;};
        var string = "脚本 " + JSON.parse(result).script.name.toString() + " 的相关信息：\n";
        string += "创建于：" + new Date(JSON.parse(result).script.created * 1000).toLocaleString().replace(",",' ') + "\n"
        string += "最后更新于：" + new Date(JSON.parse(result).script.updated * 1000).toLocaleString().replace(",",' ') + "\n"
        string += "----------------------------\n"
        string += "所有订阅者:\n"
        for(i = 0; i < JSON.parse(result).script.subscriptions.length; i++) {
          string += "* [" + JSON.parse(result).script.subscriptions[i].status.toUpperCase() + "] - " + JSON.parse(result).script.subscriptions[i].user_id + "\n";
        }
        string += "----------------------------"
        e.reply(string, true)
      });
    break;

    case "!addconfigsub" :
      if(parameters.length != 3 || !parameters[1].match(new RegExp('^[0-9]+$')) || !parameters[2].match(new RegExp('^[0-9]+$'))) {e.reply("参数格式不正确", true); return;};
      API("POST", "configs/"+encodeURI(parameters[1]) +"/subscriptions",{user_id:encodeURI(parameters[2])}).then(function(result) {
        console.log(JSON.parse(result))
        if(JSON.parse(result).errors != undefined) {e.reply("ERROR: " + JSON.parse(result).errors[0].message, true);return;};
        if(JSON.parse(result).subscription == undefined) {e.reply("ERROR: cannot resolve remote host package", true);return;};
        e.reply("添加表单-------------\n" +
                "订阅者：" + JSON.parse(result).subscription。user_id, true)
      });
    break;
    case "!delconfigsub" :
      if(parameters.length != 3 || !parameters[1].match(new RegExp('^[0-9]+$')) || !parameters[2].match(new RegExp('^[0-9]+$'))) {e.reply("参数格式不正确", true); return;};
      API("DELETE", "configs/"+encodeURI(parameters[1]) +"/subscriptions",{user_id:encodeURI(parameters[2])}).then(function(result) {
        console.log(JSON.parse(result))
        if(JSON.parse(result).errors != undefined) {e.reply("ERROR: " + JSON.parse(result).errors[0].message, true);return;};
        if(JSON.parse(result).script == undefined) {e.reply("ERROR: cannot resolve remote host package", true);return;};
        if(JSON.parse(result).script.user_id != require("../manifest").userID) {e.reply("ERROR: you're not owning this script", true);return;};
        e.reply("成功删除 UID:" + parameters[2] + "", true)
      });
    break;
    default:
      e.reply("此指令不存在/格式不正确 输入 !help 获得帮助", true);
    break;
  }
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = client;