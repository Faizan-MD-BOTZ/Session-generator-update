const { makeid } = require('./gen-id');
const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    async function FAIZAN_AI_QR_CODE() {
        // Galti yahan thi ('./temp/' + id)
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS("Desktop"),
            });

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                if (qr) {
                    if (res && !res.headersSent) {
                        res.end(await QRCode.toBuffer(qr));
                    }
                }
                
                if (connection === "open") {
                    await delay(5000);
                    // Galti yahan bhi thi ('/temp/' + id)
                    let rf = __dirname + `/temp/${id}/creds.json`;

                    try {
                        // Read the creds.json file
                        const sessionData = fs.readFileSync(rf, 'utf-8');
                        // Encode the session data to Base64
                        const base64Encoded = Buffer.from(sessionData).toString('base64');
                        // Add the prefix
                        const prefixedSession = "FAIZAN-AI~" + base64Encoded;
                        
                        // Send the prefixed Base64 session string to the user
                        let message = `*✅ APKA BASE64 SESSION ID TAYAR HAI ✅*\n\nNeechay diye gaye code ko copy karke apne bot ke SESSION_ID mein paste kar dein.\n\n*Developer: ADEEL-MD*`;
                        await sock.sendMessage(sock.user.id, { text: message });
                        await sock.sendMessage(sock.user.id, { text: prefixedSession });

                        let desc = `*┏━━━━━━━━━━━━━━*
*┃FAIZAN-AI SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = *FAIZAN-AI*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || WhatsApp Channel =* https://whatsapp.com/channel/0029VbBdQyRBPzjUMvx8Fb2g
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* https://wa.me/message/VTPGUROHLIXII1
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/Faizan-MD-BOTZ/Faizan-Ai
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*💙ᴄʀᴇᴀᴛᴇᴅ ʙʏ FAIZAN_AI💛*`;
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "FAIZAN-AI👨🏻‍💻",
                                    thumbnailUrl: "https://files.catbox.moe/agqw8v.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VbBdQyRBPzjUMvx8Fb2g",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        });
                        await sock.newsletterFollow("120363403380688821@newsletter");

                    } catch (e) {
                        console.error("Session banane mein galti hui:", e);
                        await sock.sendMessage(sock.user.id, { text: "❌ Session banane mein koi error aagaya." });
                    }

                    await delay(1000);
                    await sock.ws.close();
                    // Galti yahan bhi thi ('./temp/' + id)
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶נג 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    FAIZAN_AI_QR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            // Galti yahan bhi thi ('./temp/' + id)
            await removeFile('./temp/' + id);
            if (res && !res.headersSent) {
                res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    await FAIZAN_AI_QR_CODE();
});

module.exports = router;
