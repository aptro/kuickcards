module.exports = {
    friendlyName: 'Add Tag',
    description: 'update a tag, user can update the tag she created',
    inputs: {
        name: {
            type: 'string',
            required: true
        },
        id: {
            type: 'number',
            required: true
        }
    },

    exits: {

    },

    fn: async function (inputs, exits) {
        var tag = await Tag.update({ id: inputs.id, user: this.req.user },
            { name: inputs.name }).fetch()
        return exits.success(tag);
    }

};
