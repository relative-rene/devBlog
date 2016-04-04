// require express and other modules
var express = require('express'),
    db = require('./models'),
    app = express();

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/************
 * DATABASE *
 ************/

// var db = require('./models');

/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index(req, res) {
  // TODO: Document all your api endpoints below
  res.json({
    woops_i_has_forgot_to_document_all_my_endpoints: true, // CHANGE ME ;)
    message: "Welcome to my personal api! Here's what you need to know!",
    documentation_url: "https://github.com/example-username/express_self_api/README.md", // CHANGE ME
    base_url: "https://github.com/relative-rene/express-personal-api", // CHANGE ME
    endpoints: [
      {method: "GET", path: "/api", description: "Describes all available endpoints"},
      {method: "GET", path: "/api/event", description: "data for all upcoming Event"},
      {method: "GET", path: "/api/event/:id", description: "data for specific upcoming Event"},
      {method: "POST", path: "/api/event", description: "creating new Event"},
      {method: "DELETE", path: "/api/event/:id", description: "canceling/removing specific Event"},
      {method: "GET", path: "/api/profiles", description: "retrieve all profiles"},
      {method: "GET", path: "/api/profiles/:id", description: "retrieve specific profile"}]
    });
  });

app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});


// get all profiles
app.get('/api/profiles', function (req,res) {
  //send all profiles as json res
  db.Event.find().populate('profiles').exec(function(err,profile){
    if(err){ return console.log("index error: " +err);
  }
    res.json(profile);
  });
});

// get one profiles
app.get('/api/profiles/:id', function (req, res) {
  db.Profile.findOne({_id: req.params._id }, function(err, data) {
    res.json(data);
  });
});



// get all Event
app.get('/api/events', function (req,res) {
  //send all Event as json res
  db.Event.find().populate('Event').exec(function(err,Event){
    if(err){ return console.log("index error: " +err);
  }
    res.json(Event);
  });
});

// get one Event
app.get('/api/events/:id', function (req, res) {
  db.Event.findOne({_id: req.params._id }, function(err, data) {
    res.json(data);
  });
});

// create new Event
app.post('/api/events', function (req, res) {
  // create new book with form data (`req.body`)
  var newEvent = new db.Event({
    name: req.body.name,
    link: req.body.link,
    image: req.body.image,
    city: req.body.city,
    pets: req.body.pets
  });
  // find the author from req.body
  db.Event.findOne({name: req.body.Event}, function(err, Event){
    if (err) {
      return console.log(err);
    }
    // add this author to the bookz
    newEvent.Event = Event;

    // save newEvent to database
    newEvent.save(function(err, Event){
      if (err) {
        return console.log("save error: " + err);
      }
      console.log("saved ", Event.title);
      // send back the Event!
      res.json(Event);
    });
  });
});

// delete Event
app.delete('/api/events/:id', function (req, res) {
  // get Event id from url params (`req.params`)
  console.log('event delete', req.params);
  var EventId = req.params.id;
  // find the index of the book we want to remove
  db.Event.findOneAndRemove({ _id: EventId }, function (err, deletedEvent) {
    res.json(deletedEvents);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
