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
client.on('ready', () =>{
	client.user.setActivity(`${client.guilds.cache.size} Sunucudaki ${client.users.cache.size} Oyuncuyu`, { type : 'WATCHING' });
});
client.on('guildCreate', async guildo => {
	db.set(`prefix.${guildo.id}`, '-');
	db.set(`Klimit.${guildo.id}`, '16');
	client.user.setActivity(`${client.guilds.cache.size} Sunucudaki ${client.users.cache.size} Oyuncuyu`, { type: 'WATCHING' });

});
client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return message.channel.send('https://discord.com/oauth2/authorize?client_id=765519752947826708&permissions=0&scope=bot');
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
											if (!rrr) {
												db.set(`Sonkisi.${message.guild.id}`, message.author.id);
											}
											else if (rrr !== message.author.id) {
												if (mesaj.endsWith('ğ')) {
													db.get(`Klimit.${message.guild.id}`).then(ee => {
														db.get(`KelimeSayı.${message.guild.id}`).then(rrrr => {
															if (ee == 'Yasak') {
																message.channel.send('Sunucu Sahibi ğ ile biten kelimeleri kapattı');
															}
															if (ee == rrrr) {
																const ee3 = randomstring;
																db.set(`Oilkharf.${message.guild.id}`, ee3);
																db.delete(`KelimeSayı.${message.guild.id}`);
																db.delete(`Sonkisi.${message.guild.id}`);
																db.delete(`Kelimeler.${message.guild.id}`);
																message.channel.send(`${message.author.tag} Oyunu Bitiren Kelime Yazdı , Yazdığı Kelime ${mesaj} dı, Ve Bu Yüzden Oyun Sıfırlandı , Yeni Harfimiz ${ee3}`);
															}
															if (ee != rrrr) {
																let sayı = Number(ee);
																sayı = sayı - rrrr;
																message.delete();
																message.channel.send(`Bu Kelime ${sayı} Kelime Sonra Kullanılabilir`).then(m => {
																	m.delete({ timeout : 20000 });
																});
															}
														});
													});
												}
												else if (!mesaj.endsWith('ğ')) {
													db.get(`KelimeSayı.${message.guild.id}`).then(rrrr => {
														if (!rrrr) {
															db.set(`KelimeSayı.${message.guild.id}`, 1);
															message.react('✅');
															Array.prototype.push.apply(rr, [mesaj]);
															db.set(`Oilkharf.${message.guild.id}`, mesaj.slice(-1));
															db.set(`Kelimeler.${message.guild.id}`, rr);
															db.set(`Sonkisi.${message.guild.id}`, message.author.id);
														}
														else if (rrrr) {
															message.react('✅');
															Array.prototype.push.apply(rr, [mesaj]);
															db.set(`Oilkharf.${message.guild.id}`, mesaj.slice(-1));
															db.set(`Kelimeler.${message.guild.id}`, rr);
															db.set(`Sonkisi.${message.guild.id}`, message.author.id);
															db.set(`KelimeSayı.${message.guild.id}`, Number(rrrr) + 1);
														}
													});
												}
											}
											else if (rrr == message.author.id) {
												message.delete();
												message.channel.send('Aynı Kişi Arka Arkaya Kelime Söyleyemez').then(m => {
													m.delete({ timeout: 20000 });
												});
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
		message.channel.send('https://discord.com/oauth2/authorize?client_id=' + client.user.id + '&permissions=0&scope=bot');
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
	if (message.member.hasPermission('MANAGE_GUILD')) {
		if (command == 'prefix') {
			if (args.length) {
				await db.set('prefix.' + message.guild.id, args[0]);
				return message.channel.send(`Başarıyla prefixi \`${args[0]}\` olarak değiştirdin`);
			}

			return message.channel.send(`Prefix is \`${await db.get('prefix.' + message.guild.id)}\``);
		}
		if (command == 'oyna') {
			if (args.length) {
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
	else {return message.channel.send('Yetersiz Yetki');}
	if (command.toLocaleLowerCase() == 'ayarlar') {
		if (args[0] == 'minkelime') {
			if (!args[1]) {
				await message.channel.send(`**MinKelime Nedir ?**
MinKelime ğ harfi ile oyunu bitirme limitidir
Eğer limit 0 olursa limit Olmaz
Eğer Oyun Bitmesin İstiyorsanız 999 Yazmalısınız Otomatik olarak ğ harfi Devre Dışı Olacaktır`);
			}
			else if (args[1] == '999') {
				if (message.member.hasPermission('MANAGE_GUILD')) {
					db.set(`Klimit.${message.guild.id}`, 'Kapalı');
					message.react('✅');
				}
				else {message.react('✅');}
			}
			else if (args[1] == '0') {
				if (message.member.hasPermission('MANAGE_GUILD')) {
					db.set(`Klimit.${message.guild.id}`, 'Yasak');
					message.react('✅');
				}
				else {message.react('✅');}
			}

			else if (message.member.hasPermission('MANAGE_GUILD')) {
					db.set(`Klimit.${message.guild.id}`, args[1]);
					message.react('✅');	
			}
			else {message.react('✅');}
		}
	}
});
client.login(token);
