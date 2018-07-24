const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("---------------------------------------------------------------------------");
    console.log(req.headers);
    var token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, "secretKey");
    req.userData = decoded;
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++")
    console.log(req.userData);
    next();
    } catch (err) {
    res.status(400).json({
      message: "AuthService field!"
    })
  }
}
