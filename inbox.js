import fs from 'fs';
import os from 'os';
import path from 'path';

const getApiKey = () => {
    return fs.readFileSync('./.apikey')
        .toString('utf-8')
        .trim();
};

const getFlag = (flag) => {
    const args = process.argv;
    const index = args.indexOf('-' + flag);

    if (index === -1 || index + 1 >= args.length) {
        return null;
    }

    return args[index + 1];
};

const email = (() => {
    const email = getFlag('e') || getFlag('email');
    if (email) return email

    const file = path.join(os.tmpdir(), '.quickmail');
    if (!fs.existsSync(file)) return '';

    return fs
        .readFileSync(file)
        .toString('utf-8')
        .trim();
})();

const inbox = await fetch('https://gmailnator.p.rapidapi.com/api/inbox', {
    method: 'POST',
    headers: {
        'x-rapidapi-key': getApiKey(),
        'x-rapidapi-host': 'gmailnator.p.rapidapi.com',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        email: email,
        limit: Number((getFlag('l') || getFlag('limit'))) || 1
    })
}).then(async (res) => {
    return await res.json();
}).catch((err) => {
    console.error('Failed to get inbox -', err);
});

if (inbox.message === 'The email field must be a valid email address.') {
    console.error(`The email provided "${email}" is not valid.`);
    process.exit(-1);
}

const messages = inbox.messages.map((msg) => msg.id);
if (messages.length === 0) {
    console.error(`The email provided "${email}" has an empty inbox.`);
    process.exit(-1);
}

const scanners = [];

const customs = path.join(__dirname, 'customs');
fs.readdirSync(customs).forEach(async (file) => {
    if (!file.endsWith('.js')) return;

    const { default: scanner } = await import("./customs/" + file);
    scanners.push(scanner);
});

const allMails = await Promise.all(messages.map(async (id) => {
    const message = await fetch('https://gmailnator.p.rapidapi.com/api/inbox/' + id, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': getApiKey(),
            'x-rapidapi-host': 'gmailnator.p.rapidapi.com',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then((res) => res.json());

    return {
        from: message.from,
        subject: message.subject,
        timestamp: message.timestamp,
        time_ago: message.time_ago,
        content: message.content,
    };
}));

const scannedMails = [];

allMails.forEach((mail) => {
    const scanner = scanners.find((scan) => {
        return mail.from
            .toLowerCase()
            .includes(scan.from.toLowerCase())
    });

    if (!scanner) return;

    const important = scanner.scan(mail.content);
    if (important === null) return;

    scannedMails.push({
        from: mail.from,
        data: important,
    });
});

scannedMails.forEach((mail) => {
    console.log(`${mail.from} - ${mail.data}`);
});

if (getFlag('i') || getFlag('important')) {
    process.exit(0);
}

console.log('\n\n');

allMails.forEach((mail) => {
    console.log('from -', mail.from);
    console.log('what -', mail.subject);
    console.log('time -', mail.timestamp);
    console.log('days -', mail.time_ago);
    console.log('data -', mail.content);
    console.log('\n');
});
