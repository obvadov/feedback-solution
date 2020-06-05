const jwt = require('jsonwebtoken');

exports.authSignToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1),
        },
        process.env.JWT_SECRET_TOKEN
    );
};
