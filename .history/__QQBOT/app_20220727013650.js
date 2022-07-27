
const { createClient } = require("oicq")
const account = 2670664016
const client = createClient(account)

client.on("system.online", () => console.log("Logged in!"))
client.on("message", e => {
  console.log(e)
  e.reply("hello world", true) //true表示引用对方的消息
})

client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login()
  })
}).login()

module.exports = app;