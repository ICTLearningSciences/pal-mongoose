const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const Cohort = require("Cohort");

describe("Cohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOrCreateForName", function() {
    it("gets a cohort", async () => {
      const cohort = await Cohort.findOrCreateForName("TestCohort");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("Test Cohort");
      expect(cohort.nameCanonical).to.eql("testcohort");
    });

    it("creates a new cohort", async () => {
      const cohort = await Cohort.findOrCreateForName("New Cohort");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("New Cohort");
      expect(cohort.nameCanonical).to.eql("newcohort");
    });

    it("is case-insensitive", async () => {
      await Cohort.findOrCreateForName("New Cohort");
      const cohort = await Cohort.findOrCreateForName("nEW cOHORT");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("New Cohort");
      expect(cohort.nameCanonical).to.eql("newcohort");
    });

    it("is space-insensitive", async () => {
      await Cohort.findOrCreateForName("New Cohort");
      const cohort = await Cohort.findOrCreateForName(" New C ohort ");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("New Cohort");
      expect(cohort.nameCanonical).to.eql("newcohort");
    });
  });

  describe("paginate", function() {
    it("gets items", async () => {
      const results = await Cohort.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(3);
    });

    it("gets 1 item", async () => {
      const results = await Cohort.paginate(
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

    it("gets items after element with id", async () => {
      const results = await Cohort.paginate(
        {},
        {
          sort: { _id: 1 },
          startingAfter: "5ed82fb2a869c32825c74474"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(2);
      expect(results.items[0].name).to.eql("Test Cohort");
    });
  });
});
