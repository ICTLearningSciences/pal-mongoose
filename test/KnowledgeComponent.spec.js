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
    it("finds an initial page of items with a default limit", async () => {
      const results = await KnowledgeComponent.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(20);
      expect(results.hasMore).to.eql(true);
    });

    it("finds an initial page of items with a specified limit", async () => {
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
      expect(results.items[0].alias).to.eql("bridge-rectifier-behavior");
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await KnowledgeComponent.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5bb6540abecb4e208da0f5cf"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("basic-capacitor-filter-behavior");
      expect(results.hasMore).to.eql(true);
    });
  });
});
