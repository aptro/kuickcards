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

    var query_cards_reviewed = `
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
        log @> '{"remember":true}' AND "user" = $2) il WHERE il.year = $1
    GROUP BY
    EXTRACT(MONTH FROM created_at)
  `
    var query_cards_added = `
    SELECT
    count(*) AS count,
    to_char(to_timestamp(EXTRACT(MONTH FROM created_at)::TEXT, 'MM'), 'Mon') AS month
    FROM (
      SELECT
        to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE AS created_at,
        EXTRACT(YEAR FROM to_timestamp(TRUNC(CAST("createdAt" AS bigint) / 1000))::DATE) as year
      FROM
        card WHERE "user" = $2) AS c WHERE c.year = $1
    GROUP BY
    EXTRACT(MONTH FROM created_at)
  `
    var count_cards_reviewed = await sails.sendNativeQuery(query_cards_reviewed, [year, this.req.user.id]);
    var count_cards_added = await sails.sendNativeQuery(query_cards_added, [year, this.req.user.id]);
    var data = {
      cards_reviewed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      cards_added: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    _.forEach(labels, function (l, index) {
      _.forEach(count_cards_reviewed.rows, function (rt) {
        if (l == rt.month)
          data.cards_reviewed[index] = parseInt(rt.count);
      });
      _.forEach(count_cards_added.rows, function (rt) {
        if (l == rt.month)
          data.cards_added[index] = parseInt(rt.count);
      });
    });

    var locals = {
      //…
      filter: year,
      chart_config: {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data.cards_reviewed,
            label: 'Cards Reviewed',
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgb(153, 102, 255)",
            fill: true
          }, {
            data: data.cards_added,
            label: 'Cards Added',
            backgroundColor: "rgba(255, 159, 64, 0.7)",
            borderColor: "rgb(255, 159, 64)",
            fill: true
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Stats'
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Month'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Count'
              }
            }]
          }
        }
      }
    }

    if (this.req.query.json == 'true')
      return exits.success(locals);
    return exits.view(locals);

  }
};
