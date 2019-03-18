/*
 *algolia service emits and listens for model change events like create, destroy, update.
 *And for the same it updates the algolia Index 
 */
var algoliasearch = require('algoliasearch');

var EventEmitter = require('events').EventEmitter;
var Events = new EventEmitter();

var client = algoliasearch(sails.config.custom.algolia.application_id,
    sails.config.custom.algolia.master_api_key);

var cards = client.initIndex(sails.config.custom.algolia.index);
cards.setSettings({
    'attributesForFaceting': ['user']
});

/**
 * Common Callback listener for Algolia indexing operations 
 * Takes the event type and content, logs the response, if it gets error logs the error response 
 * 
 * @memberOf module:services/algoliaService
 * @param {string} event
 * @param {Error} err
 * @param {Object} content
 */
function handleCB(event, err, content) {
    if (err) {
        sails.log.error('Algolia Error Res For Event "' + event + '" :: ' + err.message);
    } else {
        sails.log.info('Algolia Success Res For Event "' + event + '" with objectID :: ' + content.objectID);
    }
}

/**
 * Need to format data based on Algolia Requirement.
 * - DateTime need to be Unix Timestamp
 * - objectID is same as Postgres Row Id for uniformity accross systems
 * 
 * @memberOf module:services/algoliaService
 * @param {Object}
 * @returns {Object}
 */
function formatData(data) {
    var f_data = _.cloneDeep(data);
    f_data.objectID = data.id;
    f_data.createdAt = new Date(data.createdAt).getTime();
    f_data.updatedAt = new Date(data.updatedAt).getTime();
    return f_data;
}

Events.on('card:create', function (data) {
    var f_data = formatData(data);
    cards.addObject(f_data, async.apply(handleCB, 'card:create'));
});

/**
 * using partial update will only update the provided key values And won't delete 
 * fields present in Algolia Index.
 * https://www.algolia.com/doc/api-client/javascript/indexing#partial-update
 */
Events.on('card:update', function (data) {
    var f_data = formatData(data);
    cards.partialUpdateObject(f_data, async.apply(handleCB, 'card:update'));
});

Events.on('card:destroy', function (data) {
    if (!_.isArray(data)) {
        cards.deleteObject(data.id, async.apply(handleCB, 'card:destroy'));
    } else
        _.forEach(data, function (each) {
            cards.deleteObject(each.id, async.apply(handleCB, 'card:destroy'));
        })
});


/**
 * AlgoliaService
 * @module Services/AlgoliaService
 * @description :: helpers for connecting to algolia
 */
module.exports = {
    Events: Events,
    cards: cards
};