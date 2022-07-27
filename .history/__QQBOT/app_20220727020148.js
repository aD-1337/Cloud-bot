
const { createClient } = require("oicq")
const account = require("..")
const client = createClient(account)

client.on("system.online", () => console.log("Logged in!"))
client.on("message", e => {
  console.log(e.message_type)
  e.reply("hello world", true) //true表示引用对方的消息
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = client;