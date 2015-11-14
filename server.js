var express = require('express');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var app = express();
var expressLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser');
var keywordExtractor = require('keyword-extractor');
var _ = require('lodash');


app.set('view engine', 'ejs');
app.set('layout', 'layout');
// app.set('layout', { layout:'layout.ejs'});

app.use(expressLayouts)
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(request, response) {
  response.render('index.ejs', {layout: 'layout'},
    function(err, html){
      response.send(html);
    });
});

app.post('/stopwords', function(request, response) {
  var counts = _.countBy(keywordExtractor.extract(request.body.lyrics),function(word) {
    return word;
  })
  var sorted = _.sortBy(_.pairs(counts),function(w){
    return w[1];
  }).reverse()


  for(var i = 0; i < sorted.length; i++) {
    var sort = sorted[i];
    console.log(sort)
  
    if(sort == "*******" || sort == "commercial" || sort == "lyrics")
      console.log("test")
  }

  var wordlist = _.map(sorted,function(pair){
    return pair[0];
  }).slice(0, 9)
  console.log(wordlist);
  response.json(wordlist)

})

app.get('/signup', function(request, response) {
  response.render('signup.ejs', {layout: 'layout'},
    function(err, html){
      response.send(html);
    });
})

app.get('/player', function(request, response) {
  console.log(request.query)
  response.render('player.ejs', {layout: 'layout', songid: request.query.songId, songName: request.query.songName, songArtist: request.query.songArtist, songTag: request.query.songTag},
    function(err, html){
      response.send(html);
    });
})

app.listen(3000);
console.log("Server is listening")
