/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /': { action: 'homepage' },

  'GET /faq': { view: 'pages/faq' },
  'GET /legal/terms': { view: 'pages/legal/terms' },
  'GET /legal/privacy': { view: 'pages/legal/privacy' },
  'GET /readme': { view: 'pages/readme' },

  'GET  /cards': { action: 'card/find-card' },
  'POST /cards': { action: 'card/create-card' },
  'GET /cards/:id': { action: 'card/find-one-card' },
  'GET /cards/search': { action: 'card/search-card' },
  'PUT /cards/:id': { action: 'card/update-card' },
  'DELETE /cards/:id': { action: 'card/destroy-card' },
  'POST /cards/review':{action: 'card/review-card'},
  'GET /cards/review':{action: 'card/review-card'},
  'POST /cards/review':{action: 'card/review-card'},
  
  'POST /documents/':{action: 'document/create-document'},
  'GET /documents/:id/download':{action: 'document/download-document'},
  

  'POST /tags': { action: 'tag/create-tag' },
  'PUT /tags': { action: 'tag/update-tag' },

  'GET /stats': { action: 'stat/dashboard-stat' },

  'GET /entrance/twitter': { action: 'entrance/twitter' },
  'GET /entrance/twitter/callback': { action: 'entrance/twitter-callback' },

  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/terms': '/legal/terms',
  '/logout': { action: 'account/logout' },

};
