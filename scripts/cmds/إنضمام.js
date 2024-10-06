const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = { config: {
		                  name: "انضمام",
                      aliases: ["إنضمام","ضيفيني"],
		                  version: "2.0",
		                  author: "Kshitiz", // تعريب: محمد تانجيرو \\
		                  countDown: 5,
		                  role: 0,
		                  description: { ar: "Join the group that bot is in"},
		                  category: "owner",
		                  guide: { ar: "{pn}"},
	                         },

	onStart: async function ({ api, event }) {
		try {
			const groupList = await api.getThreadList(10, null, ['INBOX']);

			const filteredList = groupList.filter(group => group.threadName !== null);

			if (filteredList.length === 0) {
				api.sendMessage('🌹البوت غير منضم لأي مجموعة', event.threadID);
			} else {
				const formattedList = filteredList.map((group, index) =>
					`│${index + 1}- الاسم: ${group.threadName}\n•آيدي: ${group.threadID}\n•عدد الأعضاء: ${group.participantIDs.length}\n`
				);
				const message = `🌹 قائمـة ڪل المجموعـات 🌹\n${formattedList.map(line => `${line}`).join("\n")}\n\n• العدد الأقصى للأعضاء = 250\n\n🌹 ࢪد علـى هـذه الࢪسـالة بࢪقـم\nالمجموعة التي تࢪيد الإنضمام لها`;

				const sentMessage = await api.sendMessage(message, event.threadID);
				global.GoatBot.onReply.set(sentMessage.messageID, {
					commandName: 'انضمام',
					messageID: sentMessage.messageID,
					author: event.senderID,
				});
			}
		} catch (error) {
			console.error("Error listing group chats", error);
		}
	},

	onReply: async function ({ api, event, Reply, args }) {
		const { author, commandName } = Reply;

		if (event.senderID !== author) {
			return api.sendMessage("🌹 لا تنتحل شخصية المطوࢪ 🙎‍♀️");
		}

		const groupIndex = parseInt(args[0], 10);

		if (isNaN(groupIndex) || groupIndex < 1) {
			api.sendMessage('🌹 إدخال خاطـئ، أدخـل ࢪقـما\nمن الأࢪقام الموجودة في القائمة', event.threadID, event.messageID);
			return;
		}

		try {
			const groupList = await api.getThreadList(10, null, ['INBOX']);
			const filteredList = groupList.filter(group => group.threadName !== null);

			if (groupIndex > filteredList.length) {
				api.sendMessage('🌹 إدخال خاطـئ، أدخـل ࢪقـما\nمن الأࢪقام الموجودة في القائمة', event.threadID, event.messageID);
				return;
			}

			const selectedGroup = filteredList[groupIndex - 1];
			const groupID = selectedGroup.threadID;

			// Check if the user is already in the group
			const memberList = await api.getThreadInfo(groupID);
			if (memberList.participantIDs.includes(event.senderID)) {
				api.sendMessage(`Can't add you, you are already in the group chat: \n${selectedGroup.threadName}`, event.threadID, event.messageID);
				return;
			}

			// Check if group is full
			if (memberList.participantIDs.length >= 250) {
				api.sendMessage(`Can't add you, the group chat is full: \n${selectedGroup.threadName}`, event.threadID, event.messageID);
				return;
			}

			await api.addUserToGroup(event.senderID, groupID);
			api.sendMessage(`You have joined the group chat: ${selectedGroup.threadName}`, event.threadID, event.messageID);
		} catch (error) {
			console.error("Error joining group chat", error);
			api.sendMessage('An error occurred while joining the group chat.\nPlease try again later.', event.threadID, event.messageID);
		} finally {
			global.GoatBot.onReply.delete(event.messageID);
		}
	},
};
