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

    var HOST = "/documents/"

    addEventListener("trix-attachment-add", function (event) {
      if (event.attachment.file) {
        uploadFileAttachment(event.attachment)
      }
    })

    function uploadFileAttachment(attachment) {
      uploadFile(attachment.file, setProgress, setAttributes)

      function setProgress(progress) {
        attachment.setUploadProgress(progress)
      }

      function setAttributes(attributes) {
        attachment.setAttributes(attributes)
      }
    }

    function uploadFile(file, progressCallback, successCallback) {
      var key = createStorageKey(file)
      var formData = createFormData(key, file)
      var xhr = new XMLHttpRequest()

      xhr.open("POST", HOST, true)

      xhr.upload.addEventListener("progress", function (event) {
        var progress = event.loaded / event.total * 100
        progressCallback(progress)
      })

      xhr.addEventListener("load", function (event) {
        if (xhr.status == 200) {
          var attributes = {
            url: window.location.protocol + "//" + window.location.host + '/documents/' + JSON.parse(xhr.response).id + '/download',
            href: '/documents/' + JSON.parse(xhr.response).id + '/download'
          }
          successCallback(attributes)
        }
      })

      xhr.send(formData)
    }

    function createStorageKey(file) {
      var date = new Date()
      var day = date.toISOString().slice(0, 10)
      var name = date.getTime() + "-" + file.name
      return ["tmp", day, name].join("/")
    }

    function createFormData(key, file) {
      var data = new FormData()
      data.append("key", key)
      data.append("file", file)
      data.append("Content-Type", file.type)
      return data
    }
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
