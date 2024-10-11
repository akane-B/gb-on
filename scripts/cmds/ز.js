const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
 config: {
 name: "ز",
 aliases: ["coupledp"],
 version: "1.0",
 author: "Loid Butter",
 countDown: 5,
 role: 0,
 description: {
 ar: "couple dp"
 },
 category: "image",
 guide: {
 ar: "{pn}"
 }
 },

 onStart: async function ({ api, event, args }) {
 try {
 const { data } = await axios.get(
 "https://tanjiro-api.onrender.com/cdp?api_ke=ytanjiro"
 );
 const maleImg = await axios.get(data.male, { responseType: "arraybuffer" });
 fs.writeFileSync(__dirname + "/tmp/img1.png", Buffer.from(maleImg.data, "utf-8"));
 const femaleImg = await axios.get(data.female, { responseType: "arraybuffer" });
 fs.writeFileSync(__dirname + "/tmp/img2.png", Buffer.from(femaleImg.data, "utf-8"));

 const msg = "Here is your couple dp";
 const allImages = [
 fs.createReadStream(__dirname + "/tmp/img1.png"),
 fs.createReadStream(__dirname + "/tmp/img2.png")
 ];
 
 return api.sendMessage({
 body: msg,
 attachment: allImages
 }, event.threadID, event.messageID);
 } catch (error) {
 console.error(error);
 }
 }
};
