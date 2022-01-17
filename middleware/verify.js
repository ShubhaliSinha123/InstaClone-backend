const jwt = require('jsonwebtoken');
config = require('../config/auth');

module.exports = async (req, res, next) => {
    try {
        var token = req.headers['x-access-token'];
    
        if(token) {
            jwt.verify(token, config.secretKey, {
                algorithms: 'HS256'
            }, function (err, decoded) {
                if(err) {
                    let errorData = {
                        message: err.message,
                        expiredAt: err.expiredAt
                    };
                    return res.status(401).send({message: "Unauthorized Access", errorData});
                }
                req.loggedInUser = decoded;
                next();
            });
        } else {
            return res.status(403).send({message: "Forbidden Access Denied!"});
        }
    } catch (error) {
        next(error);
    }
};