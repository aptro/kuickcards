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
                    id: inputs.id,
                    remember: inputs.remember
                },
                user: this.req.user.id
            });
            return exits.success({ status: 'success' });
        }
        
        var card_counts = await Card.count();
        var random_id = getRandomInt(1, card_counts);
        var card = await Card.findOne({id:random_id}).populate('tags')
        return exits.success({ card: card });
    }


};