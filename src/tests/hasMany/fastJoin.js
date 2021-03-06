const { fastJoin } = require("feathers-hooks-common");

const bazResolvers = {
  joins: {
    bars: {
      resolver: () => async (baz, { app }) =>
        (baz.bars = await app
          .service("bars")
          .find({ query: { bazId: baz._id } })),
      // joins: {
      //   bar: () => async (bar, { app }) =>
      //     (bar.foos = await app
      //       .service("foos")
      //       .find({ query: { barId: bar._id } })),
      // },
    },
  },
};

const barResolvers = {
  joins: {
    foos: {
      resolver: () => async (bar, { app }) => {
        bar.foos = await app.service("foos").find({ query: { barId: bar._id } });
        return bar;
      }
    },
  },
};

module.exports = async app => {
  app.service("bazzes").hooks({
    after: {
      all: [fastJoin(bazResolvers)]
    }
  });

  app.service("bars").hooks({
    before: {
      // all: [context => { console.log(context.params.query) }]
    },
    after: {
      all: [fastJoin(barResolvers)]
    }
  });

  app.service("foos").hooks({
    before: {
      // all: [context => { console.log(context.params.query) }]
    }
  });

  return app.service("bazzes").find()
}
