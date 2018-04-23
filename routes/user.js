var express = require('express');
var router = express.Router();
var passport = require('passport');
var {Product} = require('../models/product');
var {Order} = require('../models/order');
var {Cart} = require('../models/cart');

var csurf = require('csurf');
var csrfProtection = csurf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
      return res.write('Error');
    }
    // console.log(orders);
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });

    // res.render('user/profile', {order: orders});
  });
});

router.get('/signup', NotLoggedIn, function(req, res, next) {
  var message = req.flash('emailerror');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    errormessages: message,
    hasError: message.length,
  });
});

router.post(
  '/signup',
  passport.authenticate('local.signup', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true,
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var url = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(url);
    } else {
      res.redirect('/user/profile');
    }
  }
);

router.get('/signin', NotLoggedIn, function(req, res, next) {
  var message = req.flash('emailnot');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    errormessages: message,
    hasError: message.length > 0,
  });
});

router.post(
  '/signin',
  passport.authenticate('local-signin', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true,
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var url = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(url);
    } else {
      res.redirect('/user/profile');
    }
  }
);

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function NotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
