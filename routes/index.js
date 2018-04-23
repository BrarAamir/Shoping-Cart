var express = require('express');
var router = express.Router();
var {Product} = require('../models/product');
var {Order} = require('../models/order');
var Cart = require('../models/cart');

router.get('/', function(req, res, next) {
  var successMsg = req.flash('sucess')[0];
  Product.find().then(
    products => {
      res.render('shop/index', {
        title: 'Shopping Sites',
        products: products,
        successMsg: successMsg,
        noMessage: !successMsg,
      });
    },
    e => {
      console.log(e);
    }
  );
});
router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrize,
  });
});
router.get('/add-to-cart/:id', function(req, res, next) {
  var ProductId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(ProductId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, ProductId);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    totalPrice: cart.totalPrize,
    errMsg: errMsg,
    noError: !errMsg,
  });
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  var token = req.body.stripeToken;
  var stripe = require('stripe')('sk_test_2OVe7g9qkpApEXv764kyhgfO');
  stripe.charges.create(
    {
      amount: cart.totalPrize * 100,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    },
    function(err, charge) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id,
      });
      order.save(function(err, result) {
        req.flash('sucess', 'Sucessfull Bought Product');
        req.session.cart = null;
        return res.redirect('/');
      });
    }
  );
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
module.exports = router;
