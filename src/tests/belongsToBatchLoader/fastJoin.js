const { fastJoin } = require("feathers-hooks-common");

const fooResolvers = {
  before: context => {
    context.loaders = {};
    context.loaders.bars = context.app.service('bars').loaderFactory()
  },
  joins: {
    bars: {
      resolver: () => async (foo, { loaders }) => {
        foo.bar = await loaders.bars.load(foo.barId);
        return foo;
      },
    },
  },
};

const barResolvers = {
  before: context => {
    context.loaders = {};
    context.loaders.bazzes = context.app.service('bazzes').loaderFactory();
  },
  joins: {
    bars: {
      resolver: () => async (bar, { loaders }) => {
        bar.baz = await loaders.bazzes.load(bar.bazId);
        return bar;
      }
    },
  },
};

module.exports = async app => {
  app.service("foos").hooks({
    after: {
      all: [fastJoin(fooResolvers)]
    }
  });

  app.service("bars").hooks({
    after: {
      all: [
        context => {
          // batchLoader tries to skip itself with _populate: 'skip'
          context.params._populate = null
        },
        fastJoin(barResolvers)
      ]
    }
  });

  return app.service("foos").find()
}
