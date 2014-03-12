var request = require('request');
var tincan = 'https://tincan.continu.co';


// need basic auth set up with request

exports.token = function (client, user, cb) {
  var opts = {
    url: tincan + '/oAuth/token',
    json: true,
    auth: client,
    body: {
      username: user.email,
      password: user.last_name.toLowerCase(),
      grant_type: 'password'
    }
  };
  request.post(opts, function(err, res, body){
    if(err) { return cb(err, null); }
    if(res.statusCode == 401) {
      user.username = user.email;
      user.password = user.last_name.toLowerCase();
      var options = {
        url: tincan + '/oAuth/register',
        json: true,
        body: user
      };
      request.post(options, function (err, res, registerbody){
        if(err) { return cb(err, null); }
        if (res.statusCode == 200) {
          request.post(opts, function (err, res, tokenBody){
            if(err) { return cb(err, null); }
            if(res.statusCode == 200) {
              return cb(null, tokenBody);
            } else {
              return cb(tokenBody, null);
            }
          });
        } else {
          return cb(registerbody, null);
        }
      });
    } else {
      return cb(null, body);
    }
  });
};

exports.get = function (path, token, cb) {
  var opts = {
    url: tincan + path,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  request.get(opts, function (err, res, body) {
    if ( err ) { return (err, null); }
    cb(null, body);
  });
};