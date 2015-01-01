var express = require('express');
var router = express.Router();
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		console.log("User not authenticated, redirecting to login page");
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	// Login page
	router.get('/', function(req, res) {
		// Check if user already loggedin, if yes, redirect to home page
		// isAuthenticated(req, res, function(req, res) {
		// 	console.log("User authenticated, redirecting to home.");
		// 	res.redirect('/home');
		// })
		if(req.isAuthenticated()) {
			console.log("User authenticated, redirecting to home.");
			res.redirect('/home');
		}
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	// Handle Login POST
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	// GET Registration Page. Working but not showing for 6 Jan release
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	// Home Page: ToDo: UI
	router.get('/home', isAuthenticated, function(req, res){
		var data = {
			'user' : req.user
		}
		res.render('home', { 'data': data });
	});

	// Handle Logout
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// router.get('/userlist', isAuthenticated, function(req,res) {
	// 	var users = User.find();
	// 	res.render('userlist', {'users': users});
	// });

	router.get('/userlist', function(req, res) {
		User.find({}, function(err, users) {
			var userMap = {};

			users.forEach(function(user) {
				userMap[user._id] = user;
			});

			res.render('userlist', {'users': userMap});
		});
	});

	return router;
}





