module.exports = {
    friendlyName: 'create document',
    description: '',
    inputs: {
        id: {
            type: 'string',
            required: true
        }
    },

    exits: {

    },

    fn: async function (inputs, exits) {
        var file = await Document.findOne({ id: inputs.id, user: this.req.user.id });
        if (!file) { throw 'notFound'; }

        this.res.attachment(file.fileName);
        var downloading = await sails.startDownload(file.fd);
        return exits.success(downloading);
    }

};
