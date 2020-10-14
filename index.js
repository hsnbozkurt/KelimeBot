const dc = require('discord.js');
const { token, dbname } = require('./config.json');
const client = new dc.Client();
const sozluk = require('sozlukjs');
const Keyv = require('keyv');
const db = new Keyv(`sqlite://./${dbname}.sqlite`);
const globalPrefix = '-';
db.on('error', err => console.error('Keyv connection error:', err));

const chars = 'abcçdefghıijklmnoöprsştuüvyz';
const string_length = 1;
let randomstring = '';
for (let i = 0; i < string_length; i++) {
	const rnum = Math.floor(Math.random() * chars.length);
	randomstring += chars.substring(rnum, rnum + 1);

}

client.on('message', async message => {
	if (message.author.bot) return;
	db.get(`Okanal.${message.guild.id}`).then(r => {
		if (message.channel.id == r) {
			db.get(`Oilkharf.${message.guild.id}`).then(r2 => {
				if (message.content.startsWith(r2)) {
					sozluk.TDKDictionary.getMeaningData(message.content)
						.then(data => {
							if (data.error == 'Sonuç bulunamadı') {
								message.delete();
								message.channel.send('Hocam Öyle Kelime yok').then(m => {
									const ms = '20000';
									m.delete({ timeout: ms });
								});
							}
							else if (data[0].madde_id) {
								db.set(`Oilkharf.${message.guild.id}`, message.content.slice(-1));
								message.react('✅');
							}
						});
				}
			});
		}
	});
	let args;
	// handle messages in a guild
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		}
		else {
			const guildPrefix = await db.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		// if we found a prefix, setup args; otherwise, this isn't a command
		if (!prefix) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);
	}
	else {
		// handle DMs
		message.channel.send('https://discord.com/oauth2/authorize?client_id=765519752947826708&permissions=0&scope=bot');
	}

	const command = args.shift().toLowerCase();
	function getUserFromMention(mention) {
		if (!mention) return;

		if (mention.startsWith('<#') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return mention;
		}
	}
	if (command === 'prefix') {
		if (args.length) {
			if (message.member.hasPermission('MANAGE_GUILD')) {
				await db.set(message.guild.id, args[0]);
				return message.channel.send(`Başarıyla prefixi \`${args[0]}\` olarak değiştirdin`);
			}
			else {
				return message.channel.send('Yetersiz Yetki');
			}
		}

		return message.channel.send(`Prefix is \`${await db.get(message.guild.id) || globalPrefix}\``);
	}
	if (command == 'oyna') {
		if (args.length) {
			if (message.member.hasPermission('MANAGE_GUILD')) {
				console.log(getUserFromMention(args[0]));
				const e = randomstring;
				db.set(`Okanal.${message.guild.id}`, getUserFromMention(args[0]));
				db.get(`Okanal.${message.guild.id}`).then(r => {
					client.channels.cache.get(r).send(`İlk Harfimiz ${e} İyi Oyunlar dilerim`);
					db.set(`Oilkharf.${message.guild.id}`, e);
				},
				);
			}
		}
	}


});
client.login(token);