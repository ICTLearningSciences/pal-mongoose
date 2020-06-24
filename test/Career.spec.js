const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Career = require("Career");

describe("Career", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOneByIdOrAlias", function() {
    it("finds one by alias", async () => {
      const item = await Career.findOneByIdOrAlias(
        "e6-petty-officer-first-class"
      );
      expect(item).to.have.property("name", "E6 Petty Officer First Class");
    });

    it("finds one by id string", async () => {
      const item = await Career.findOneByIdOrAlias("5d799472becb4e208db91c7b");
      expect(item).to.have.property("name", "E6 Petty Officer First Class");
    });

    it("finds one by id object", async () => {
      const item = await Career.findOneByIdOrAlias(
        mongoose.Types.ObjectId("5d799472becb4e208db91c7b")
      );
      expect(item).to.have.property("name", "E6 Petty Officer First Class");
    });
  });

  describe("findSuggested", function() {
    it("finds a career marked as default suggested", async () => {
      const item = await Career.findSuggested();
      expect(item).to.have.property("name", "E2 Fire Controlman");
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await Career.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(4);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await Career.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("e2-fire-controlman");
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await Career.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5d799472becb4e208db91c7a"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("e6-petty-officer-first-class");
      expect(results.hasMore).to.eql(true);
    });
  });
});
