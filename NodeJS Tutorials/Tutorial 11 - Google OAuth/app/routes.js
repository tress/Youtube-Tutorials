var User = require('./models/user');
module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});
	


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.html');
	});
	app.post('/profile', function(req, res) {
               var event = {
                'start': {
                  'dateTime': request.body.startdate,
                },
                'end': {
                  'dateTime': request.body.enddate
                },
              },
        };

       calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
        }, function(err, event) {
          if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
              return;
        }
          console.log('Event created: %s', event.htmlLink);
           });
    // ...
        });

	

	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email' , 'calendar']}));

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}
