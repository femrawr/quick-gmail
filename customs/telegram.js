export default {
    from: 'telegram.org',

    scan(data) {
        const match = data.match(/Your code is:\s*(\d{6})\b/i);
        return match ? match[1] : null;
    }
};
