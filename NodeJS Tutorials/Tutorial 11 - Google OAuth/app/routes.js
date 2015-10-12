var User = require('./models/user');
var google = require('googleapis');
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

        
	app.get('/profile', isLoggedIn, function(req, res) {
        var html = '<form action="/profile" method="post">' +
               'Enter your email:' +
               '<input type="text" name="email" placeholder="..." />' +
               '<br>' +
               'Enter start dateTime:' +
               '<input type="datetime-local" name="to" id="to" value="2014-12-08T15:43:00">' +
               '<br>' +
               ' enter end dateTime:' +
               '<input type="datetime-local" name="from" id="from" value="2014-12-08T15:43:00">' +
               '<br>' +
               '<button type="submit">create event</button>' +
            '</form>';
               
       res.send(html);
        });
        app.post('/profile',isLoggedIn, function(req, res){
        var event = {
             'status':'confirmed',
              'organizer': {
               'email': req.body.email,
               'self': true
                },
                'start': {
                 'dateTime': request.body.from,
                },
                'end': {
                'dateTime': request.body.to
                },
                'transparency': 'public',
                'visibility': 'transparent',
     };
       var calendar = google.calendar('V3');

       calendar.events.insert({
       auth: auth,
       calendarId: 'primary',
        resource: event,
       }, function(err, event) {
          if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
       }
       var html='Hello event link is: ' + event.htmlLink + '.<br>' 
       });
        res.send(html);
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
