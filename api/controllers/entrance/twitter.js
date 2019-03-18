var passport = require('passport');
module.exports = {


  friendlyName: 'Twitter',


  description: 'Twitter entrance.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var _this = this;
    passport.authenticate('twitter', function (err, user, info) {
      if (err)
        return _this.res.view('500');

      if (!user) {
        _this.res.redirect('/')
      }
      _this.req.logIn(user, function (err) {
        if (err)
          return _this.res.view('500');
        return _this.res.redirect('/cards');
      });
    })(this.req, this.res);

  }
};

