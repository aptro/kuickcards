module.exports = {
  friendlyName: 'Delete card',
  description: '',

  inputs: {
    id: {
      description: 'The id of card to look up',
      type: 'number',
      required: true
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    await Card.destroy({ id: inputs.id, user: this.req.user.id }).fetch();
    return exits.success();
  }

};
