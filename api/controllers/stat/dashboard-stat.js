var moment = require('moment');
module.exports = {


  friendlyName: 'View stats',


  description: 'Display "Stats" page.',

  inputs: {
    filter: {
      type: 'string'
    }
  },

  exits: {

    success: {

    },

    view: {
      responseType: 'view',
      viewTemplatePath: 'pages/stats'
    }

  },


  fn: async function (inputs, exits) {
    var date_criteria = {}
    if (!inputs.filter)
      inputs.filter = 1;
    if (inputs.filter != "all") {
      date_criteria.createdAt = { '>': parseInt(moment().subtract(parseInt(inputs.filter), "days").toDate().getTime()) };
    }
    var cards_learned = await InteractionLog.count(_.extend({ type: 'card:reviewed', user: this.req.user.id }, date_criteria));
    var total_cards = await Card.count(_.extend({ user: this.req.user.id }, date_criteria));
    // Respond with view.
    var r = { cards_learned: cards_learned, total_cards: total_cards };
    if (this.req.query.json == 'true')
      return exits.success(r);
    return exits.view(r);

  }


};
