var passport = require('passport');
module.exports = {


  friendlyName: 'Twitter callback',


  description: '',


  inputs: {

  },


  exits: {
    redirect: {
      responseType: 'redirect',
      description: 'Requesting user is logged in, so redirect to the internal welcome page.'
    },
  },


  fn: async function (inputs, exits) {
    var _this = this;
    passport.authenticate('twitter', function (err, user, info) {
      if (err) {
        sails.log.error('Error while authenticating', err);
        return _this.res.view('500');
      }

      if (!user) {
        _this.res.redirect('/')
      }
      _this.req.logIn(user, function (err) {
        if (err) {
          sails.log.error('Error while logging in', err);
          return _this.res.view('500');
        }
        return _this.res.redirect('/cards');
      });
    })(this.req, this.res);
  }


};
