module.exports = {


  friendlyName: 'View find one card',


  description: 'Display "Find one card" page.',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/card/findOne'
    }

  },


  fn: async function (inputs, exits) {
    var tags = await Tag.find({ user: this.req.user.id });

    if (inputs.id == 'create')
      return exits.success({ tags: tags })
    if (_.isNaN(parseInt(inputs.id)))
      return this.res.notFound();
    var card = await Card.findOne({ id: inputs.id, user: this.req.user.id }).populate('tags')
    if (!card)
      return this.res.notFound();
      
    // Respond with view.
    return exits.success({ card: card, tags: tags });
  }


};
