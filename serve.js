// created by austin brown - 15 July 2017

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  oauthserver = require('oauth2-server');

const Model = require('./lib/Model');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const _validResponse = function(req, res) {
  res.send("Auth is valid");
};

// password grant auth
const pModel = new Model();
const pGrant = oauthserver({
  model: pModel,
  grants: ['password'],
  accessTokenLifetime: 60, // in seconds
  debug: true
});
app.post('/oauth/p/token', pGrant.grant());
app.get('/p', pGrant.authorise(), _validResponse);
app.use('/p', pGrant.errorHandler());

// client_credentials + refresh_token grant auth
const ccrtModel = new Model();
const ccrtGrant = oauthserver({
  model: ccrtModel,
  grants: ['client_credentials', 'refresh_token'],
  accessTokenLifetime: 300, // in seconds
  refreshTokenLifetime: 3600, // in seconds
  debug: true
});
app.post('/oauth/ccrt/token', ccrtGrant.grant());
app.delete('/oauth/ccrt/token', function(req, res) {
  ccrtModel.expireAccessToken(req.body.access_token, function(err, _res) {
    res.end();
  });
});
app.get('/ccrt', ccrtGrant.authorise(), _validResponse);
app.use('/ccrt', ccrtGrant.errorHandler());

// listen
const port = 4001; // forty-hundred and one, best I could do...
app.listen(port);
console.log(`Open sesame on port ${port}!`);
