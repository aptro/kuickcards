module.exports = {


  friendlyName: 'View Card',


  description: 'Display Card page.',

  inputs: {
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: `pages/card/find`
    }
  },


  fn: async function (inputs, exits) {
    var cards = await Card.find({ user: this.req.user.id }).populate('tags').sort('id DESC');
    var tags = await Tag.find({ user: this.req.user.id });

    // Respond with view.
    return exits.success({ cards: cards, tags: tags });

  }


};
