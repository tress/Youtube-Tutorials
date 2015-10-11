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

        app.get('/profile', function(req, res){
        // The form's action is '/' and its method is 'POST',
        // so the `app.post('/', ...` route will receive the
        // result of our form
        var html = '<form action="/profile" method="post">' +
                      'Enter your name:' +
                      '<input type="text" name="userName" placeholder="..." />' +
                      '<br>' +
                      '<button type="submit">Submit</button>' +
                   '</form>';
               
        res.send(html);
        });

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
        app.post('/profile', function(req, res){
        var userName = req.body.userName;
        var html = 'Hello: ' + userName + '.<br>' +
             '<a href="/">Try again.</a>';
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
