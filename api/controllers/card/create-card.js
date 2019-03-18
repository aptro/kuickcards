module.exports = {
  friendlyName: 'create a card',
  description: '',

  inputs: {
    question: {
      type: 'string',
      required: true
    },
    id: {
      type: 'number'
    },
    answer: {
      type: 'string'
    },
    tags: {
      type: 'ref'
    }
  },


  exits: {
    success: {
    }
  },

  fn: async function (inputs, exits) {
    var payload = {
      user: this.req.user.id,
      question: inputs.question,
      answer: inputs.answer,
      tags: inputs.tags
    }

    var card = await Card.create(payload).fetch();
    return exits.success(card);
  }
};
