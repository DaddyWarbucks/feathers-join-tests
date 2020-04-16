const { fastJoin } = require("feathers-hooks-common");

const fooResolvers = {
  joins: {
    bars: {
      resolver: () => async (foo, { app }) => {
        foo.bar = await app.service("bars").get(foo.barId);
        return foo;
      },
      // joins: {
      //   baz: () => async (foo, { app }) => {
      //     foo.bar.baz = await app.service("bazzes").get(foo.bar.bazId);
      //     return foo;
      //   }
      // },
    },
  },
};

const barResolvers = {
  joins: {
    baz: {
      resolver: () => async (bar, { app }) => {
        bar.baz = await app.service("bazzes").get(bar.bazId);
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
      all: [fastJoin(barResolvers)]
    }
  });

  return app.service("foos").find()
}
