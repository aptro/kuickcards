parasails.registerPage('card-find', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    syncing: false,
    // Form data
    formData: {
      tags: []
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    cardformRules: {
      question: { required: true }
    },

    tagFormRules: {
      name: { required: true }
    },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    cards: [],
    sms: null,
    filteredTag: 'all'
  },
  props: [],
  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    _.extend(this, SAILS_LOCALS);
    this.all_cards = _.clone(this.cards);
  },

  watch: {
    cards: function (val) {
      console.log('cards array updated')
      this.$nextTick(function () {
        $('.ui.dropdown.card_opt')
          .dropdown('refresh');
        $('.card_opt').click(function (event) {
          event.stopPropagation();
        });
      });
    }
  },
  mounted: async function () {
    //…
    $('.card_opt').click(function (event) {
      event.stopPropagation();
    });
    $('.add_tag')
      .popup({
        on: 'click',
        // boundary: '.container'
      });
    $('.ui.dropdown.card_opt')
      .dropdown();
    $('.ui.dropdown.tags')
      .dropdown();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    test: function (a) {
      console.log(a);
    },
    formatDate: parasails.util.formatDate,
    createOrEditCard: function (card) {
      $('.tags').dropdown('refresh');
      this.err = undefined;
      var _this = this;
      if (card) {
        _this.formData = {
          question: card.question,
          tags: _.map(card.tags, function (l) { return l.id.toString() }),
          id: card.id,
          answer: card.answer ? card.answer : ''
        }
        $('.ui.dropdown.tags').dropdown('set exactly', _this.formData.tags);
      };

      $('.modal.createOrEditCard').modal({
        observeChanges: true, onHidden: function () {
          _this.formData = {
            tags: []
          };
          $('.ui.dropdown.tags').dropdown('clear');
        }
      })
        .modal('show')
        ;
    },

    deleteCard: async function (id) {
      var _this = this
      $(`#${id}`).addClass('active');
      Cloud['destroyCard'].with({ id: id }).exec(function (err, q) {
        $(`#${id}`).removeClass('active');
        if (err) {
          _this.err = err.code;
        }
        else {
          let myToast = Vue.toasted.show('l', { position: "top-center" });
          myToast.text("Card Deleted").goAway(1000);
          var inde = _.findIndex(_this.cards, { id: id })
          _this.cards.splice(inde, 1);
        }
      })
    },

    submittedCardForm: async function (result) {
      // Redirect to the logged-in dashboard on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      var ind = _.findIndex(this.cards, { id: result.id })
      if (ind > -1)
        this.cards[ind] = result;
      else
        this.cards.unshift(result);

      // Reset form data
      this.formData = {
        tags: []
      };

      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
      $('.modal.createOrEditCard')
        .modal('hide');
      ;
    },

    submittedTagForm: async function (result) {
      let myToast = this.$toasted.show('l', { position: "top-center" });
      myToast.text("tag added").goAway(1000);
      this.tags.push(result)

      // Reset form data
      this.formData = {
        tags: []
      };

      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
      $('.add_tag')
        .popup('hide')
        ;
    },

    filterTag: function (id) {
      $("[data-tag='" + this.filteredTag + "']").removeClass('active');
      $("[data-tag='" + id + "']").addClass('active');
      this.filteredTag = id;
      var _this = this
      this.cards = [];
      _.forEach(this.all_cards, function (l) {
        if (!l) return;
        var filtered_tags = _.filter(l.tags, { id: id });
        if (filtered_tags.length) {
          _this.cards.push(l);
        }
      });
      this.$nextTick(function () {
        $('.ui.sticky')
          .sticky({
            context: '#card-find'
          });
      });
    },

    filterAllTags: function () {
      $("[data-tag='" + this.filteredTag + "']").removeClass('active');
      $("[data-tag='all']").addClass('active');
      this.filteredTag = "all";
      this.cards = this.all_cards;
      this.$nextTick(function () {
        $('.ui.sticky')
          .sticky({
            context: '#card-find'
          });
      });
    },

    findOneCard: function (id) {
      window.location.href = '/cards/' + id;
    }
  }
});
