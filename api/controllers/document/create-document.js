module.exports = {
    friendlyName: 'create document',

    description: '',

    files: ['file'],

    inputs: {
        file: {
            description: 'Upstream for an incoming file upload.',
            type: 'ref'
        },
    },

    exits: {

    },

    fn: async function (inputs, exits) {
        var uploaded = await sails.uploadOne(inputs.file);
        var document = await Document.create({ fileName: _.get(uploaded, 'stream.fd'), fd: uploaded.fd, mime: uploaded.type, user: this.req.user.id }).fetch();
        exits.success({ id: document.id });
    }

};
