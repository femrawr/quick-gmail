export default {
    from: 'noreply@github.com',

    scan(data) {
        const match = data.match(/https:\/\/github\.com\/account_verifications\/confirm\/[\w-]+\/(\d{8})/);
        return match ? match[1] : null;
    }
};
