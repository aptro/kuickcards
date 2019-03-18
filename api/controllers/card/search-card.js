module.exports = {


  friendlyName: 'Search',


  description: 'Search learning.',


  inputs: {
    q: {
      type: "string",
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var _this = this;
    AlgoliaService.cards.search({ query: inputs.q, filters: `user = ${_this.req.user.id}` }, function (err, s) {
      if (err)
        return _this.res.json(500, { status: 'failure', error: err.message });
      return exits.success(s);
    });
  }


};
