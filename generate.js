import fs from 'fs';
import os from 'os';
import path from 'path';

const getApiKey = () => {
    return fs.readFileSync('./.apikey')
        .toString('utf-8')
        .trim();
};

const saveEmail = (email) => {
    if (process.argv[2] === '-d' || process.argv[2] === '-dontsave') {
        return;
    }

    const file = path.join(os.tmpdir(), '.thugmail');
    fs.writeFileSync(file, email);
};

const data = await fetch('https://gmailnator.p.rapidapi.com/api/emails/generate', {
    method: 'POST',
    headers: {
        'x-rapidapi-key': getApiKey(),
        'x-rapidapi-host': 'gmailnator.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        type: ['private_gmail_dot', 'private_gmail_plus']
    })
}).then(async (res) => {
    return await res.json();
}).catch((err) => {
    console.error('Failed to generate email -', err);
});

saveEmail(data.email);
console.log(data.email);
