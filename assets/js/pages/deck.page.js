parasails.registerPage('deck', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },
    //…
    deckFormRules: {
      name: { required: true }
    },

    formData: {},
    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    syncing: false,

    currentDeckId: null,
    currentDeckData: null
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    this.currentDeckId = this.decks.length ? this.decks[0].id : null
    if (this.currentDeckId)
      this.showDeckDetail(this.decks[0].id);
    //…
    $('.add_deck')
      .popup({
        on: 'click',
        // boundary: '.container'
      });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    formatDate: parasails.util.formatDate,

    submittedDeckForm: async function (result) {
      this.decks.push(result)

      let myToast = this.$toasted.show('l', { position: "top-center" });
      myToast.text("Deck created").goAway(1000);

      // Reset form data
      this.formData = {
        decks: []
      };

      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
      $('.add_deck')
        .popup('hide')
        ;
    },
    showDeckDetail: function (id) {
      $('.dimmer').addClass('active');
      var _this = this;
      console.log('current: ', this.currentDeckId);
      console.log('new: ', id);

      $("[data-deck='" + this.currentDeckId + "']").removeClass('active');
      $("[data-deck='" + id + "']").addClass('active');
      this.currentDeckId = id;
      Cloud['findoneDeck'].with({
        id: id
      }).exec(function (err, q) {
        _this.currentDeckData = q;
        $('.dimmer').removeClass('active');
      });
    }
  }
});
