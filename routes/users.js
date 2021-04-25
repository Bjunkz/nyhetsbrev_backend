var express = require('express');
var router = express.Router();
var rand = require("random-key");
var CryptoJS = require("crypto-js");


// get/hämta alla 
router.get('/', (req, res) =>{
  
  req.app.locals.db.collection("users").find().toArray()
  .then( results => {
      console.log(results)
      

  })
});

//logga in
router.post('/login', (req, res) =>{
  
  req.app.locals.db.collection("users").find().toArray()
  .then( results => {
    let user = req.body;
    let findUser = results.find(a => a.userName == user.userName)
    if(findUser){
    let storedPass = CryptoJS.AES.decrypt(findUser.password, "Salt Nyckel").toString(CryptoJS.enc.Utf8)
      if(user.password == storedPass){
        res.json({"code": "success",
                 "userKey": findUser.userKey })
        console.log("success");
      } 
    } else {
      res.json("fail")
      console.log("fail");
    }
  })
});

//posta en ny användare
router.post('/post', function(req, res, next) {

   req.app.locals.db.collection("users").find().toArray()
  .then( results => {
      
    let newUser = req.body;

    let findUser = results.find(item => item.userName == newUser.userName)

    if (findUser == undefined){

        let key = rand.generate()
        let userPass = newUser.password;
        let cryptedPass = CryptoJS.AES.encrypt(userPass, "Salt Nyckel").toString()

        let newUserObject = {
          "firstName": newUser.firstName,
          "lastName": newUser.lastName,
          "userName": newUser.userName,
          "password": cryptedPass,
          "email": newUser.email,
          "newsletter": newUser.newsletter == "true" ? true : false,
          "userKey": key
            };

          req.app.locals.db.collection("users").insertOne(newUserObject)
          console.log("newUserObject:" + newUserObject)
          res.json("success")
        } else {
          res.json("fail")
        }
  
  });
})
//hämta nyhetsbrev prenumerations-status
router.post('/newsletterstatus', function(req, res, next) {

  user = req.body;
  console.log(user.userName)
  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
    let status = results.find(a => a.userName == user.userName)
    res.json(status.newsletter)
  })
  
})

//ändra nyhetsbrev
router.post('/newsletter', function(req, res, next) {

  user = req.body;
  console.log(user.userName)
  req.app.locals.db.collection("users").updateOne({"userName": user.userName}, {$set: {"newsletter": user.newsletter}} )
  .then(res.send(user.newsletter))
})



//delete
router.get('/delete', function(req, res, next) {

  req.app.locals.db.collection("users").deleteMany({"email": "b.eriksson91@gmail.com"})
  .then(results => console.log(results))


})



module.exports = router;
