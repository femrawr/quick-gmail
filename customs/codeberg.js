export default {
    from: 'noreply@codeberg.org',

    scan(data) {
        const match = data.match(/https:\/\/codeberg\.org\/user\/activate\?[^"'<>\\s]+/i);
        return match ? match[0] : null;
    }
};
