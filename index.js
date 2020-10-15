const dc = require('discord.js');
const { token, dbname } = require('./config.json');
const client = new dc.Client();
const sozluk = require('sozlukjs');
const Keyv = require('keyv');
const db = new Keyv(`sqlite://./${dbname}.sqlite`);
db.on('error', err => console.error('Keyv connection error:', err));
const chars = 'abcçdefghıijklmnoöprsştuüvyz';
const string_length = 1;
let randomstring = '';
for (let i = 0; i < string_length; i++) {
	const rnum = Math.floor(Math.random() * chars.length);
	randomstring += chars.substring(rnum, rnum + 1);
}
client.on('guildCreate', async guildo => {
	db.set(`prefix.${guildo.id}`, '-');
	db.set(`Klimit.${guildo.id}`, '16');
});
client.on('message', async message => {
	if (message.author.bot) return;
	db.get(`Okanal.${message.guild.id}`).then(r => {
		if (message.channel.id == r) {
			db.get(`Oilkharf.${message.guild.id}`).then(r2 => {
				if (message.content.toLocaleLowerCase().startsWith(r2)) {
					const mesaj = message.content.toLocaleLowerCase();
					sozluk.TDKDictionary.getMeaningData(mesaj)
						.then(data => {
							if (data.error == 'Sonuç bulunamadı') {
								message.delete();
								message.channel.send('Hocam Öyle Kelime yok').then(m => {
									const ms = '20000';
									m.delete({ timeout: ms });
								});
							}
							else if (data[0].madde_id) {
								db.get(`Kelimeler.${message.guild.id}`).then(rr => {
									if (!rr) {
										const ar = new Array(mesaj);
										db.set(`Kelimeler.${message.guild.id}`, ar);
									}
									else if (rr.includes(mesaj)) {
										message.delete();
										message.channel.send(`${message.content} daha önce kullanılmış`).then(m2 => {
											const ms = '20000';
											m2.delete({ timeout: ms });
										});
									}
									else {
										db.get(`Sonkisi.${message.guild.id}`).then(rrr => {
											if (rrr == 'undefined') {
												db.set(`Sonkisi.${message.guild.id}`, message.author.id);
											}
											else if (rrr !== message.author.id) {
												if (mesaj.endsWith('ğ')) {
													const yeniharf = randomstring;
													message.channel.send(`Eveet Oyun Bitti Çünkü Birisi ğ ile Biten Kelime Yazdı ${yeniharf} Sonraki Harfimiz **İyi Oyunlar**`);
													db.delete(`Oilkgarf.${message.guild.id}`);
													db.delete(`Kelimeler.${message.guild.id}`);
													db.delete(`Sonkisi.${message.guild.id}`);
												}
												else if (!mesaj.endsWith('ğ')) {
													message.react('✅');
													Array.prototype.push.apply(rr, [mesaj]);
													db.set(`Oilkharf.${message.guild.id}`, mesaj.slice(-1));
													db.set(`Kelimeler.${message.guild.id}`, rr);
													db.set(`Sonkisi.${message.guild.id}`, message.author.id);
												}
											}
											else if (rrr == message.author.id) {
												message.channel.send('Aynı Kişi Arka Arkaya Kelime Söyleyemez');
											}
										});
									}
								});
							}
						});
				}
				else if (!message.content.toLocaleLowerCase().startsWith(r2)) {
					message.delete();
					message.channel.send(`Yanlış Harfle Başlayan Mesaj  Attın Şu Andaki Harf ${r2}`).then(m3 => {
						m3.delete({ timeout: 20000 });
					});
				}
			});
		}
	});
	let args;
	// handle messages in a guild
	if (message.guild) {
		let prefix;

		if (message.content.startsWith('eqwwwqew')) {
			prefix = 'eqwwwqew';
		}
		else {
			const guildPrefix = await db.get(`prefix.${message.guild.id}`);
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
				await db.set('prefix.' + message.guild.id, args[0]);
				return message.channel.send(`Başarıyla prefixi \`${args[0]}\` olarak değiştirdin`);
			}
			else {
				return message.channel.send('Yetersiz Yetki');
			}
		}

		return message.channel.send(`Prefix is \`${await db.get('prefix.' + message.guild.id)}\``);
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
	if (command.toLocaleLowerCase() == 'ayarlar') {
		if (args[0] == 'minkelime') {
			if (!args[1]) {
				await message.channel.send(`**MinKelime Nedir ?**
MinKelime ğ harfi ile oyunu bitirme limitidir
Eğer limit 0 olursa limit Olmaz
Eğer Oyun Bitmesin İstiyorsanız 999 Yazmalısınız Otomatik olarak ğ harfi Devre Dışı Olacaktır`);
			}
			else if (args[1] == '999') {
				db.set(`Klimit.${message.guild.id}`, 'Kapalı');
			}
			else if (args[1] == '0') {
				db.set(`Klimit.${message.guild.id}`, 'Yasak');
			}
			// eslint-disable-next-line no-constant-condition
			else if (args[1] !== '999', '0') {
				db.set(`Klimit.${message.guild.id}`, args[1]);
			}
		}
	}

});
client.login(token);