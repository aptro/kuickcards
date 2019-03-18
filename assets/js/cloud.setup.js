/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"homepage":{"verb":"GET","url":"/","args":[]},"findCard":{"verb":"GET","url":"/cards","args":[]},"createCard":{"verb":"POST","url":"/cards","args":["question","id","answer","tags"]},"findOneCard":{"verb":"GET","url":"/cards/:id","args":["id"]},"searchCard":{"verb":"GET","url":"/cards/search","args":["q"]},"updateCard":{"verb":"PUT","url":"/cards/:id","args":["question","id","answer","tags"]},"destroyCard":{"verb":"DELETE","url":"/cards/:id","args":["id"]},"reviewCard":{"verb":"POST","url":"/cards/review","args":["id","remember"]},"createTag":{"verb":"POST","url":"/tags","args":["name"]},"updateTag":{"verb":"PUT","url":"/tags","args":["name","id"]},"dashboardStat":{"verb":"GET","url":"/stats","args":["filter"]},"twitter":{"verb":"GET","url":"/entrance/twitter","args":[]},"twitterCallback":{"verb":"GET","url":"/entrance/twitter/callback","args":[]},"logout":{"verb":"GET","url":"/logout","args":[]}}
  /* eslint-enable */

});
