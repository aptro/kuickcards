function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
    friendlyName: 'View review',

    description: 'Display review page.',

    inputs: {
        id: {
            type: 'number'
        },
        remember: {
            type: 'boolean'
        }
    },

    exits: {

        success: {
            viewTemplatePath: 'pages/card/review'
        }

    },

    fn: async function (inputs, exits) {
        if (inputs.id) {
            await InteractionLog.create({
                type: 'card:reviewed',
                log: {
                    id: inputs.id
                },
                user: this.req.user.id
            });
            return exits.success({ status: 'success' });
        }

        var query = await sails.sendNativeQuery('SELECT id FROM card where "user"=$1 ORDER BY RANDOM() LIMIT 1', [this.req.user.id])
        if (!query.rows.length)
            return exits.success({ card: null });
        var card = await Card.findOne({ id: query.rows[0].id }).populate('tags')
        return exits.success({ card: card });
    }

};