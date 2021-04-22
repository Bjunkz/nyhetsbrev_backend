var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/admin', function(req, res, next) {

let adminTemplate = `
<form action="/admin/login" method="post">
<p>welcome to admin-login</p>
<input type="password" name="password">
<button type="submit">Login</button></form>
`

res.send(adminTemplate)
  
});

router.post('/admin/login', function(req, res, next) {

  console.log(req.body.password)

  if(req.body.password == "admin"){
    req.app.locals.db.collection("users").find().toArray()
    .then(results => {
      let usersTemplate = "";
      let emailTemplate = "";

      for (user in results){
        usersTemplate += `<div>${results[user].userName}</div>`
        emailTemplate += `<div>${results[user].email}</div>`
      }
 
      let adminLoginTemplate = `
      <p>users<br>${usersTemplate}</p><br>
      <p>emails<br>${emailTemplate}</p>
      `
      res.send(adminLoginTemplate)
    })

  } else {
    res.redirect('/admin')
  }
});

module.exports = router;
