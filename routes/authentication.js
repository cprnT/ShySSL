var jwt = require('jwt-simple');
var fs  = require('fs');
var q   = require('q');
var readFileAsync = q.denodeify(fs.readFile);
var writeFileAsync= q.denodeify(fs.writeFile);
var pathToUsers = __dirname.slice(0,__dirname.lastIndexOf('/'))+'/users/';
var auth = {

  login: function(req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate(username, password).then(function(dbUserObj){
      console.log("dbUSerObj:",dbUserObj);
      if(dbUserObj.hasOwnProperty('username')){
        res.json(genToken(dbUserObj));
      }
      else{
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
      }
    });

  },
  setPassword:function(username,password){
    return writeFileAsync(pathToUsers+username,password);
  },
  changePassword:function(req,res){
    var username = req.body.username || '';
    var password = req.body.oldPassword || '';
    var newPassword = req.body.newPassword || '';
    if(username === '' || password === '' || newPassword === '') {
      res.send('Empty fields not allowed');
    }
    auth.validate(username,password).then(function(result){
      if(result.hasOwnProperty('username')){
        //valid user
        auth.setPassword(username,newPassword).then(function(){
          res.sendStatus(200);
        },function(err){
          res.json(err);
          console.log(err);
        });
      }else{
        res.sendStatus(401);
      }
    });
  },

  registerUser:function(req,res){
    var user = req.body.user;
    var password = req.body.password;
    readFileAsync(pathToUsers+user).then(
        function(content){
          res.sendStatus(401);
        },
        function(){
          fs.writeFileSync(pathToUsers+user,password);
          res.sendStatus(200);
        })
  }
  ,


  validate: function(username, password) {
    return readFileAsync(pathToUsers+username).then(
        function(content){
          content = content.toString();
          if(password === content){
            if(username === 'admin'){
              return {
                username:'admin',
                role:'admin'
              }
            }else{
              return{
                username:username,
                role:'regularUser'
              }
            }
          }else{
            return 'Invalid user or password';
          }
        },
      function(error){
        return error.toString();
      });
  }
};

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
