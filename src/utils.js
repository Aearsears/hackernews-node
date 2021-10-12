const jwt = require('jsonwebtoken');
const APP_SECRET = 'weoiajrweiprfjsdkljgnaweiotpjewaiofj42374582934750we89';

function getTokenPayload(token) {
    return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }
    throw new Error('not authenticated');
}
module.exports = {
    APP_SECRET,
    getUserId,
};
