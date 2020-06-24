const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Resource = require("Resource");

describe("Resource", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOneByIdOrAlias", function() {
    it("finds one by alias", async () => {
      const item = await Resource.findOneByIdOrAlias("inots-pushing-the-line");
      expect(item).to.have.property(
        "uri",
        "https://dev.inots.org/8/?noheader=true"
      );
    });

    it("finds one by id string", async () => {
      const item = await Resource.findOneByIdOrAlias(
        "5cffef5ebecb4e208d44eb41"
      );
      expect(item).to.have.property(
        "uri",
        "https://dev.inots.org/8/?noheader=true"
      );
    });

    it("finds one by id object", async () => {
      const item = await Resource.findOneByIdOrAlias(
        mongoose.Types.ObjectId("5cffef5ebecb4e208d44eb41")
      );
      expect(item).to.have.property(
        "uri",
        "https://dev.inots.org/8/?noheader=true"
      );
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await Resource.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(6);
      expect(results.hasMore).to.eql(false);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await Resource.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("Polynomials Overview");
      expect(results.hasMore).to.eql(true);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await Resource.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5b5a2cd69b1fafcf999d9222"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("diodes-101-mcq-prerequisites-02");
      expect(results.hasMore).to.eql(true);
    });
  });
});
