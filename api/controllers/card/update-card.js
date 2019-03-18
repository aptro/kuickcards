module.exports = {
    friendlyName: 'create a card',
    description: '',
  
    inputs: {
      question: {
        type: 'string',
        required: true
      },
      id: {
        type: 'number',
        required: true
      },
      answer: {
        type: 'string'
      },
      tags: {
        type: 'ref'
      }
    },
  
  
    exits: {
      success: {
      }
    },
  
    fn: async function (inputs, exits) {
      var payload = {
        user: this.req.user.id,
        question: inputs.question,
        answer: inputs.answer,
        tags: inputs.tags
      }
  
      await Card.update(inputs.id,payload);
      var card  = await Card.findOne(inputs.id);
      return exits.success(card);
    }
  };
  