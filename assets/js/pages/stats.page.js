parasails.registerPage('stats', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    this.ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(this.ctx, this.chart_config);
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
        _this.chart_config = q.chart_config;
        _this.filter = q.filter;
        window.myLine.data = _this.chart_config.data;
        window.myLine.update()
        $('.inverted.dimmer').removeClass('active');
      });
    }
  }
});
