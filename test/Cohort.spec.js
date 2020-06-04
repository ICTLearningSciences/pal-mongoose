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
});
