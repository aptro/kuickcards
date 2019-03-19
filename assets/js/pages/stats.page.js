window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
var color = Chart.helpers.color;

parasails.registerPage('stats', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    filter: "<%=req.query.filter%>",
    cards_learned: 0,
    total_cards: 0,
    chart_config: {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: SAILS_LOCALS.remember_true,
          label: 'Remember',
          backgroundColor: color(window.chartColors.purple).alpha(0.7).rgbString(),
          borderColor: window.chartColors.purple,
          fill: true
        }, {
          data: SAILS_LOCALS.remember_false,
          label: 'Not Remember',
          backgroundColor: color(window.chartColors.green).alpha(0.7).rgbString(),
          borderColor: window.chartColors.green,
          fill: true
        }, {
          data: SAILS_LOCALS.card_added,
          label: 'Cards Added',
          backgroundColor: color(window.chartColors.orange).alpha(0.7).rgbString(),
          borderColor: window.chartColors.orange,
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
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    this.
      _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, this.chart_config);
    if (canvas.height < 400) {
      window.myLine.options.legend.display = false;
      window.myLine.update();
    }
  },
  watch: {
    filter: function (val) {
      window.location = '/stats?filter=' + val;
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    filterChanged: function () {
      $('.inverted.dimmer').addClass('active');
      var _this = this;
      Cloud['dashboardStat'].with({ filter: this.filter, json: true }).exec(function (err, q) {
        $('.inverted.dimmer').removeClass('active');
        _this.cards_learned = q.cards_learned;
        _this.total_cards = q.total_cards;

      })
    }
  }
});
