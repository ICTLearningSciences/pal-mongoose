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
    it("gets items", async () => {
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

    it("gets 1 item", async () => {
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
      expect(results.hasMore).to.eql(true);
    });
  });
});
