/**
 * Card.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    question: {
      type: 'string',
      columnType: 'text',
      required: true
    },

    answer: {
      type: 'string',
      columnType: 'text',
      allowNull: true
    },

    detail: {
      type: 'json',
      columnType: 'jsonb'
    },

    is_archived: {
      type: 'boolean',
      allowNull: true
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    user: {
      model: 'user',
      required: true
    },

    tags: {
      collection: 'tag',
      via: 'cards'
    }
  },

  afterCreate: function (instance, cb) {
    AlgoliaService.Events.emit('card:create', instance);
    cb(null);
  },

  afterUpdate: function (instance, cb) {
    AlgoliaService.Events.emit('card:update', instance);
    cb(null);
  },

  afterDestroy: function (instance, cb) {
    AlgoliaService.Events.emit('card:destroy', instance);
    cb(null);
  }
};

