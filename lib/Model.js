// original source @ oauth2-server/examples/memory/model.js

const _ = require('lodash');

class Model {
  constructor(options) {

    // In-memory hard-set datastores:
    this.oauthAccessTokens = [];
    this.oauthRefreshTokens = [];
    this.oauthClients = [{
      clientId: 'thom',
      clientSecret: 'nightworld',
      redirectUri: ''
    }];
    this.authorizedClientIds = {
      password: [
        'thom'
      ],
      refresh_token: [
        'thom'
      ],
      client_credentials: [
        'thom'
      ]
    };
    this.users = [{
      id: '123',
      username: 'thomseddon',
      password: 'nightworld'
    }];
  }

  // Debug function to dump the state of the data stores
  dump() {
    console.log('oauthAccessTokens', this.oauthAccessTokens);
    console.log('oauthClients', this.oauthClients);
    console.log('authorizedClientIds', this.authorizedClientIds);
    console.log('oauthRefreshTokens', this.oauthRefreshTokens);
    console.log('users', this.users);
  }

  /*
   * Required
   */

  getAccessToken(bearerToken, callback) {
    for (var i = 0, len = this.oauthAccessTokens.length; i < len; i++) {
      var elem = this.oauthAccessTokens[i];
      if (elem.accessToken === bearerToken) {
        return callback(false, elem);
      }
    }
    callback(false, false);
  }

  getRefreshToken(bearerToken, callback) {
    for (var i = 0, len = this.oauthRefreshTokens.length; i < len; i++) {
      var elem = this.oauthRefreshTokens[i];
      if (elem.refreshToken === bearerToken) {
        return callback(false, elem);
      }
    }
    callback(false, false);
  }

  getClient(clientId, clientSecret, callback) {
    for (var i = 0, len = this.oauthClients.length; i < len; i++) {
      var elem = this.oauthClients[i];
      if (elem.clientId === clientId &&
        (clientSecret === null || elem.clientSecret === clientSecret)) {
        return callback(false, elem);
      }
    }
    callback(false, false);
  }

  grantTypeAllowed(clientId, grantType, callback) {
    callback(false, this.authorizedClientIds[grantType] &&
      this.authorizedClientIds[grantType].indexOf(clientId.toLowerCase()) >= 0);
  }

  saveAccessToken(accessToken, clientId, expires, userId, callback) {
    this.oauthAccessTokens.unshift({
      accessToken: accessToken,
      clientId: clientId,
      userId: userId,
      expires: expires
    });

    callback(false);
  }

  saveRefreshToken(refreshToken, clientId, expires, userId, callback) {
    this.oauthRefreshTokens.unshift({
      refreshToken: refreshToken,
      clientId: clientId,
      userId: userId,
      expires: expires
    });

    callback(false);
  }

  /*
   * Required to support password grant type
   */
  getUser(username, password, callback) {
    for (var i = 0, len = this.users.length; i < len; i++) {
      var elem = this.users[i];
      if (elem.username === username && elem.password === password) {
        return callback(false, elem);
      }
    }
    callback(false, false);
  }

  /*
   *  Required to support client_credentials grant type
   */
  getUserFromClient(clientId, clientSecret, callback) {
    // normally this would hit a redirect uri and obtain the user via a signin form, but in our case we're a bit more lenient...
    const client = _.find(this.oauthClients, { clientId: clientId, clientSecret: clientSecret });
    if (client) {
      callback(false, this.users[0]);
    } else {
      callback(false, false);
    }
  }

  /*
   * Optional
   */

  expireAccessToken(accessToken, callback) {
    for (var i = 0, len = this.oauthAccessTokens.length; i < len; i++) {
      var elem = this.oauthAccessTokens[i];
      if (elem.accessToken === accessToken) {
        elem.expires = new Date();
      }
    }
    callback(false);
  }

}

module.exports = Model;
