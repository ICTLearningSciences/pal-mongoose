const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const MultipleChoiceQuestion = require("MultipleChoiceQuestion");

describe("MultipleChoiceQuestion", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("paginate", function() {
    it("gets items", async () => {
      const results = await MultipleChoiceQuestion.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(0);
      expect(results.hasMore).to.eql(false);
    });
  });
});
