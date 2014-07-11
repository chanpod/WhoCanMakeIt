
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = express();
var port = process.env.PORT || 8000;

/**
 * Configuration
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());


/**
 * Routes
 */

var router = express.Router();


router.get('/viewEvent', routes.viewEvent);
router.get('/', routes.index);

app.use('/', router);


app.post('/createEvent', routes.createEvent);

/**
 * Start Server
 */

app.listen(port);
console.log("Listening on port 8000");
console.log('...');
