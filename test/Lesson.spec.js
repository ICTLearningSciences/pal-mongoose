const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Lesson = require("Lesson");

describe("Lesson", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOneByIdOrAlias", function() {
    it("finds one by alias", async () => {
      const item = await Lesson.findOneByIdOrAlias(
        "diode-action-review-diode-current-flow"
      );
      expect(item).to.have.property("name", "Review Diode Current Flow");
      expect(item).to.have.property(
        "alias",
        "diode-action-review-diode-current-flow"
      );
    });

    it("finds one by id string", async () => {
      const item = await Lesson.findOneByIdOrAlias("5bb6540cbecb4e208da0fa6d");
      expect(item).to.have.property("name", "Polynomials Overview");
      expect(item).to.have.property(
        "alias",
        "polynomials-intro-polynomials-overview"
      );
    });

    it("finds one by id object", async () => {
      const item = await Lesson.findOneByIdOrAlias(
        mongoose.Types.ObjectId("5bb6540cbecb4e208da0fa6d")
      );
      expect(item).to.have.property("name", "Polynomials Overview");
      expect(item).to.have.property(
        "alias",
        "polynomials-intro-polynomials-overview"
      );
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await Lesson.paginate(
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
      const results = await Lesson.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("diode-action-diodes-tutorial");
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await Lesson.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5bb6540cbecb4e208da0f9b4"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql(
        "diode-action-transistors-sneak-peak"
      );
      expect(results.hasMore).to.eql(true);
    });
  });
});
