module.exports = {
  friendlyName: 'Add Tag',
  description: '',
  inputs: {
    name: {
      type: 'string',
      required: true
    }
  },

  exits: {

  },


  fn: async function (inputs, exits) {
    var tag = await Tag.create({ name: inputs.name, user: this.req.user.id }).fetch()
    return exits.success(tag);
  }

};
