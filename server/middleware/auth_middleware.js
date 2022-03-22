const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res
                .status(401)
                .json({ msg: "No authentication token, authorization denied." });
        }
        const verified = jwt.verify(token, 'NishantSecretKey');
        if (!verified) {
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });
        }
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = auth;