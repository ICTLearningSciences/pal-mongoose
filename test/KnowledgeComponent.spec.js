const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const KnowledgeComponent = require("KnowledgeComponent");

describe("KnowledgeComponent", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("paginate", function() {
    it("gets items", async () => {
      const results = await KnowledgeComponent.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 99
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(50);
      expect(results.hasMore).to.eql(false);
    });

    it("gets 1 item", async () => {
      const results = await KnowledgeComponent.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.hasMore).to.eql(true);
    });
  });
});
