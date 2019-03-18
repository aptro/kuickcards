parasails.registerPage('card-find-one', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    card: {
      question: '',
      answer: '',
      tags: [],
      id: null,
      createdAt: new Date()
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    //…
    console.log(this.card)

    $('.ui.dropdown.tags').dropdown('set exactly', _.map(this.card.tags, function (l) { return l.id.toString() }));
  },

  watch: {
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    formatDate: parasails.util.formatDate,

    onAnswerUpdate: function (a) {
      console.log(a);
      this.card.answer = a;
    },
    //…
    createOrUpdateCard: function () {
      var _this = this;
      $('.inverted.dimmer').addClass('active');
      var action = 'createCard'
      var payload = {
        question: _this.card.question,
        answer: _this.card.answer,
        tags: _this.card.tags
      }
      if (_this.card.id) {
        payload.id = _this.card.id
        action = 'updateCard'
      }
      Cloud[action].with(
        payload
      ).exec(function (err, q) {
        let myToast = Vue.toasted.show('l', { position: "top-center" });
        if (err) {
          myToast.text('Error Occurred').goAway(1000);
        }
        if (!_this.card.id) {
          _this.card.id = q.id;
          myToast.text('card created').goAway(1000);
          window.history.pushState('l_c', 'Kuickcards', '/cards/' + q.id);
          // window.location = '/cards/' + q.id
        } else {
          myToast.text('card updated').goAway(1000);
        }

        $('.inverted.dimmer').removeClass('active');
      });
    }
  }
});
