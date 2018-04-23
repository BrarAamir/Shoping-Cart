var {Product} = require('../models/product');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopping');
var product = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic Videos Game',
    description: 'Awesome Video Game !!!',
    price: 10,
  }),
  new Product({
    imagePath:
      'http://ksassets.timeincuk.net/wp/uploads/sites/54/2016/06/football-1-1.jpg',
    title: 'FootBall',
    description: 'Awesome Video Game !!!',
    price: 13,
  }),
  new Product({
    imagePath: 'http://i.imgci.com/espncricinfo/Jigsaw-464x225.jpg',
    title: 'Cricket',
    description: 'Awesome Video Game !!!',
    price: 50,
  }),
  new Product({
    imagePath:
      'https://vignette.wikia.nocookie.net/gamegrumps/images/d/d0/DS3.jpg/revision/latest?cb=20160403081139',
    title: 'Dark Souls 3 Video Game',
    description: 'Awesome Video Game !!!',
    price: 10,
  }),
  new Product({
    imagePath:
      'https://www.tubefilter.com/wp-content/uploads/2015/03/minecraft-logo.jpg',
    title: 'Minecraft Video Game',
    description: 'Awesome Video Game !!!',
    price: 10,
  }),
];
var done = 0;
for (var i = 0; i < product.length; i++) {
  product[i].save(function(err, res) {
    done++;
    if (done === product.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
