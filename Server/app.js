const createError = require('http-errors'),
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose"),
  Messages = require("./models/messages.js"),
  Users = require("./models/users.js"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  nodemailer = require("nodemailer"),
  checkAuth = require("./middleware/check_auth"),
  buffer = require('buffer'),
  path = require('path'),
  fs = require('fs'),
  http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server)

mongoose.connect("mongodb://localhost:27017/Chat");

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var incr = function (ind) {
  var i = ind;
  return function () {
    return i++;
  }
};


Messages.find().sort({uniqueId: -1}).limit(1)
  .exec()
  .then((data) => {
    if (data.length < 1) {
      incr = incr(0);
    } else {
      console.log(data);
      incr = incr(data[0].uniqueId + 1);
    }
  })


io.on('connection', (socket) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
  socket.on('userConnected', (data) => {
//    console.log(data, "ddddddddddddddddddddataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

    //console.log("userConnected")
    Users.findByIdAndUpdate(data.userId, {online: true}, {new: true}, function (err, user) {
      if (err) {
        console.log(err);
      }
      user.save();
      console.log(user, "truuuuuuuuuu+++++++++++++++++++++++++++++");

    });
    socket.broadcast.emit("setOnline", {userId: data.userId})

  })

  socket.on('userDisconnect', (data) => {
    //  console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    Users.findByIdAndUpdate(data.userId, {online: false}, {new: true}, function (err, user) {
      if (err) {
        console.log(err);
      }
      user.save();

      //   console.log(user, "falseeeeeeeeeee");

    });
    socket.broadcast.emit("setOffline", {userId: data.userId})
  });

  socket.on('disconnect', function () {
    app.post("/destroy", (req, res) => {
      //  console.log(req.body.userId);
      //   console.log("oooooooooooooooooooooooooooooooooooo")
      var promise = new Promise((resolve, reject) => {
        Users.findByIdAndUpdate(req.body.userId, {online: false}, {new: true}, function (err, user) {
          user.save();
          //  console.log(user, "falseeeeeeeeeee");
        });
        resolve("done");
      })
        .then((v) => {
          res.end()
        })
    })
  });


  console.log('connection made')
  socket.on('message', (data) => {
    const messages = new Messages({
      uniqueId: incr(),
      from: data.user,
      message: data.message,
      time: new Date()
    });

    messages.save()
      .then((message) => {
        Messages.findOne({"_id": message._id})
          .populate("from")
          .exec((err, msg) => {
            if (err) {
              throw err;
            }
            var newData = {
              avatar: msg.from.avatar,
              from: msg.from._id,
              message: msg.message,
              data: formatAMPM(msg.time)
            }
            io.emit("newMessage", newData);
          })
      })
    console.log(messages)
  })
})


// app.post("/destroy", (req, res)=>{
//   console.log(req.body.userId);
//   console.log("oooooooooooooooooooooooooooooooooooo")
//   res.status(200).json({
//     message: "ok"
//   })
// })

function decode_base64(img) {
  var pattern = /image-*/;
  if (!img.ext.match(pattern)) {
    return false;
  }
  const base64str = img.data;
  let buf = Buffer.from(base64str.split(",")[1], 'base64');
  let imgPath = 'public/images/users';
  const filename = new Date().getTime() + "." + img.ext.split("/")[1];
  fs.writeFile(path.join(imgPath, filename), buf, function (error) {
    if (error) {
      throw error;
    } else {
      console.log('File created from base64 string!');
      return true;
    }
  });
  return "images/users" + "/" + filename;
}

app.post("/register", (req, res) => {
  if (req.body.img == "") {
    var avatar = "images/chatIcon/userIcon.png"
  }
  else {
    if (decode_base64(req.body.img)) {
      avatar = decode_base64(req.body.img);
    } else {
      res.status(400).json({
        message: "file is not an image!"
      });
    }
  }
  let r = validateRegistration(req.body);
  if (r.isValid) {
    Users.findOne({'email': req.body.email}, (err, user) => {
      if (user) {
        r.message = "You are already registered";
        res.status(400).json({message: r.message});
      } else {
        bcrypt.hash(req.body.registpassword, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            })
          }
          const user = new Users({
            fullname: req.body.registusername,
            email: req.body.email,
            password: hash,
            avatar: avatar,
          });

          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
            },
            "EmailSecretToken",
            {
              expiresIn: "7d",
            });
          user.token = token;

          console.log(token);
          user.save()
            .then((user) => {
                let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'sixelitmetorgroup@gmail.com',
                    pass: 'Sixelit123'
                  }
                });
                let mailOptions = {
                  from: 'sixelitmetorgroup@gmail.com',
                  to: req.body.email,
                  subject: 'Email Verification',
                  html: `
                          <!doctype html>
                          <html lang="en">
                          <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                          </head>
                          <body>     
                          <div style="text-align: center">
                            <div class="row">
                              <div class="col-12">
                                <h2 class="text-center">Hello ${user.fullname}</h2>
                                <img src="http://localhost:3000/${user.avatar}" alt="">
                                 <img src="http://kudoscasino.com/wp-content/uploads/2017/07/verify-your-email.png" alt="">
                                <p>Verify your email address</p>
                            <a href="http://localhost:3000/login/${token}" type="button" style="background-color: darkblue; color: white; border-radius: 4px; padding: 10px; text-decoration: none; font-size: 20px" >Verify your email</a>
                                <br>
                                <br>
                              </div>
                            </div>
                          </div>
                          
                          
                          </body>
                          </html>
`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                r.message = ""; //??
                res.status(200).json({
                  message: r.message,
                  token: token
                })
              }
            )
            .catch(
              (err) => {
                res.status(500).json({
                  error: err
                })
              })

        })
      }
    })
  } else {
    res.status(400).json({
      message: r.message
    });
  }
});


function validateRegistration(userJSON) {
  console.log("---------------------------");
  //  console.log(userJSON);
  // /^
  // (?=.*\d)        - should contain at least one digit
  // (?=.*[a-z])     - should contain at least one lower case
  // (?=.*[A-Z])     - should contain at least one upper case
  // [a-zA-Z0-9]{8,} - should contain at least 8 from the mentioned characters
  // $/
  var passwordRegExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
  var emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (!userJSON.registusername) {
    return {
      isValid: false,
      message: "Please enter your Name",
    }
  }
  if (!userJSON.registpassword) {
    return {
      isValid: false,
      message: "Please enter your password",
    }
  } else {
    if (!passwordRegExp.test(userJSON.registpassword)) {
      return {
        isValid: false,
        message: "Please check your password \n" +
        "1) it will contain at least one digit\n" +
        "2) it will contain at least one lower case\n" +
        "3) it will contain at least one upper case\n" +
        "4) it will contain at least 8 from the mentioned characters"
      }
    }
  }
  if (!userJSON.email) {
    return {
      isValid: false,
      message: "Please enter your email",
    }
  } else {
    if (!emailRegExp.test(userJSON.email)) {
      return {
        isValid: false,
        message: "Please  check your email \n" +
        "should be adamsmit@gmail.com format",
      }
    }
  }
  return {
    isValid: true,
    message: "Thank you for registration to our site",
  }
}

app.post("/login", (req, res) => {
  Users.findOne({"email": req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(403).json({
          message: "User can not find",
        })
      }

      if (user.active) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(403).json({
              type: "password",
              message: "Password is wrong!"
            })
          }
          if (result) {
            var token = jwt.sign({
                email: user.email,
                user_id: user._id,
              },
              "secretKey",
              {
                expiresIn: "7d",
              }
            );
            res.status(200).json({
              token: "Bearer " + token
            })
          }
          else {
            return res.status(403).json({
              type: "password",
              message: "Password is wrong!"
            })
          }
        })
      } else {
        res.status(403).json({
          type: "confirm",
          message: "You must confirm your  email address!",
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(403).json({            //----------------------------------------------------------------
        type: "email",
        message: "Email is invalid"
      })
    })
})

app.get("/login/:id", (req, res) => {
  Users.findOne({"token": req.params.id})
    .exec()
    .then((user) => {
      Users.findByIdAndUpdate(user["_id"], {new: true})
        .exec()
        .then((user) => {
          user.active = true;
          user.save();
        })
        .catch((err) => res.send(err));
    })
  res.redirect("http://localhost:4200/login");
})


var getIndex = function (i) {
  i = i;
  return function () {
    return i -= 20;
  }
}

var ind;
var x;
var docLength;
app.get("/chat", checkAuth, (req, res) => {

  Messages.find({})
    .exec()
    .then(doc => {
      docLength = doc.length;

      ind = docLength - 20;
      x = getIndex(ind);
      var _id = req.userData["user_id"];
      Users.findOne({"_id": _id})
        .exec()
        .then((user) => {
          if (user.length < 1) {
            res.status(400).json({
              message: "User can not find",
            })
          }
          else {
            var logUser = user;
            Users.find({"active": true})
              .exec()
              .then((users) => {
                console.log(users);
                Messages.find({})
                  .populate("from")
                  .where('uniqueId').gt(docLength - 20).lt(docLength + 1)
                  .exec((err, msgs) => {
                    console.log(docLength - 20, "************", docLength)
                    console.log(msgs, " -----------------------------------------------------------------------------");
                    var tmpMsgs = msgs.map((msg) => {

                      return {
                        uniqueId: msg.uniqueId,
                        from: msg.from._id,
                        data: formatAMPM(msg.time),
                        avatar: msg.from.avatar,
                        message: msg.message
                      }
                    })

                    res.status(200).json({
                      user: logUser,
                      users: users,
                      messages: tmpMsgs
                    });
                  })

              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                })
              })
          }
        })
    })
    .catch((err) => {
      res.status(500).json({
        message: "User can not find",
      })
    })
});


app.get('/loadNextMessages', (req, res) => {
  var startInd = x();
  var endInd = startInd + 21;

  if (startInd < 0) {
    startInd = -1;
  }

  console.log(startInd, "*************", endInd, " ************ ", docLength)
  Messages.find({})
    .populate("from")
    .where('uniqueId').gt(startInd).lt(endInd)
    .exec((err, msgs) => {
      var tmpMsgs = msgs.map((msg) => {

        return {
          uniqueId: msg.uniqueId,
          from: msg.from._id,
          data: formatAMPM(msg.time),
          avatar: msg.from.avatar,
          message: msg.message
        }
      })
      // console.log(msgs,  "8888888888888888888888888888888888888888888888888")
      res.status(200).json({
        msgs: tmpMsgs
      })
    })
});

app.post("/changeAvatar", checkAuth, (req, res) => {
  var newAvatar;
  if (req.body.img == "") {
    newAvatar = "images/chatIcon/userIcon.png"
  }
  else {
    newAvatar = decode_base64(req.body.img);
  }
  Users.findOne({_id: req.userData["user_id"]})
    .exec()
    .then(user => {
      if (user.avatar !== "images/chatIcon/userIcon.png") {
        console.log(user.avatar, "--------------++++++++++++++++++------------------------")
        fs.unlink("public/" + user.avatar, function (err) {
          if (err) throw err;
          console.log('File deleted!');
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })


  Users.findByIdAndUpdate(req.userData["user_id"], {avatar: newAvatar}, {new: true}, function (err, user) {
    if (err) {
      console.log(err);
    }
    user.save();
    res.status(200).json({
      user: user
    })
  })
})

server.listen(8000, function () {
  console.log("socket run!!!")
})

app.listen(3000, function () {
  console.log("server run!!!");
});

