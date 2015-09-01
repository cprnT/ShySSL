var jwt = require('jwt-simple');
var fs  = require('fs');
var q   = require('q');
var readFileAsync = q.denodeify(fs.readFile);
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
      if(dbUserObj.hasOwnProperty('name')){
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


    if (dbUserObj) {

      // If authentication is success, we will generate a token
      // and dispatch it to the client

      res.json(genToken(dbUserObj));
    }

  },

  changePassword:function(req,res){
    var username = req.body.username || '';
    var password = req.body.oldPassword || '';
    var newPassword = req.body.newPassword || '';
    if(username === '' || password === '' || newPassword === '') {
      res.send('Empty fields not allowed');
    }

    auth.validate(username,password).then(function(result){
      if(result.hasOwnProperty('name')){
        //valid user
        auth.setPassword(username,newPassword);
        res.sendStatus(200);
      }else{
        res.send('Invalid user or password');
      }
    });
  },

  registerUser:function(req,res){
    var path = '../users/';
    var user = req.body.user;
    var password = req.body.password;
    readFileAsync(path+user).then(
        function(content){
          res.sendStatus(401);
        },
        function(){
          fs.writeFileSync(path+user,password);
          res.sendStatus(200);
        })
  }
  ,
  setPassword:function(username,password){
    var path = '../users/';
    return writeFileAsync(path+username,password);
  },

  validate: function(username, password) {
    return fs.readFileAsync('../users/'+username).then(
        function(content){
          if(password === content){
            if(username === 'admin'){
              return {
                name:'admin',
                role:'admin'
              }
            }else{
              return{
                name:username,
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
