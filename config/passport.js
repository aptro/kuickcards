var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


passport.use(new Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    // hostname + /entrance/twitter/callback
    callbackURL: process.env.TWITTER_CALLBACK_URL
},
    function (token, tokenSecret, profile, cb) {
        User.findOrCreate({ twitterId: profile.id }, { twitterId: profile.id, twitterUsername: profile.username, fullName: profile.displayName }).exec(cb);
    }
));