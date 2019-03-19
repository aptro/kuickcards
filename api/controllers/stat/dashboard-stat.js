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
    var year = inputs.filter ? inputs.filter : new Date().getFullYear();

    var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var query_remember_true = `
    SELECT
    count(*) AS count,
    to_char(to_timestamp(EXTRACT(MONTH FROM created_at)::TEXT, 'MM'), 'Mon') AS month
    FROM (
      SELECT
        to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE AS created_at,
        log ->> 'remember' AS remember,
        EXTRACT(YEAR FROM to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE) as year
      FROM
        interactionlog
      WHERE
        log @> '{"remember":true}') il WHERE il.year = $1
    GROUP BY
    EXTRACT(MONTH FROM created_at)
  `
    var query_remember_false = `
    SELECT
    count(*) AS count,
    to_char(to_timestamp(EXTRACT(MONTH FROM created_at)::TEXT, 'MM'), 'Mon') AS month
    FROM (
      SELECT
        to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE AS created_at,
        log ->> 'remember' AS remember,
        EXTRACT(YEAR FROM to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE) as year
      FROM
        interactionlog
      WHERE
        log @> '{"remember":false}') il WHERE il.year = $1
    GROUP BY
    EXTRACT(MONTH FROM created_at)
  `
    var query_card_added = `
    SELECT
    count(*) AS count,
    to_char(to_timestamp(EXTRACT(MONTH FROM created_at)::TEXT, 'MM'), 'Mon') AS month
    FROM (
      SELECT
        to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE AS created_at,
        EXTRACT(YEAR FROM to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE) as year
      FROM
        card) AS c WHERE c.year = $1
    GROUP BY
    EXTRACT(MONTH FROM created_at)
  `
    var count_remember_true = await sails.sendNativeQuery(query_remember_true, [year]);
    var count_remember_false = await sails.sendNativeQuery(query_remember_false, [year]);
    var count_card_added = await sails.sendNativeQuery(query_card_added, [year]);
    var locals = {
      remember_true: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      remember_false: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      card_added: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    _.forEach(labels, function (l, index) {
      _.forEach(count_remember_true.rows, function (rt) {
        if (l == rt.month)
          locals.remember_true[index] = parseInt(rt.count);
      });
      _.forEach(count_remember_false.rows, function (rt) {
        if (l == rt.month)
          locals.remember_false[index] = parseInt(rt.count);
      });
      _.forEach(count_card_added.rows, function (rt) {
        if (l == rt.month)
          locals.card_added[index] = parseInt(rt.count);
      });
    })

    if (this.req.query.json == 'true')
      return exits.success(locals);
    return exits.view(locals);

  }


};
