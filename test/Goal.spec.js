const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Goal = require("Goal");

describe("Goal", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOneByIdOrAlias", function() {
    it("finds one by alias", async () => {
      const item = await Goal.findOneByIdOrAlias("advancement-test-fc-e3");
      expect(item).to.have.property("name", "Advancement Test - FC E3");
    });

    it("finds one by id string", async () => {
      const item = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      expect(item).to.have.property("name", "Advancement Test - FC E3");
    });

    it("finds one by id object", async () => {
      const item = await Goal.findOneByIdOrAlias(
        mongoose.Types.ObjectId("5b5a2cd69b1fafcf999d957e")
      );
      expect(item).to.have.property("name", "Advancement Test - FC E3");
    });
  });

  describe("findUniqueTopicIds", () => {
    it("returns the topics as an array of ids", async () => {
      const goal = await Goal.findOneByIdOrAlias("advancement-test-fc-e3");
      const topicIds = goal
        .findUniqueTopicIds()
        .map(x => `${x}`) // because these are object ids and easier to compare strings
        .sort();
      expect(topicIds).to.eql([
        "5bb6540bbecb4e208da0f6e1",
        "5bb6540bbecb4e208da0f6e3",
        "5bb6540bbecb4e208da0f6e7",
        "5bb6540bbecb4e208da0f6e9",
        "5bb6540bbecb4e208da0f6eb",
        "5bb6540bbecb4e208da0f6ee",
        "5bb6540bbecb4e208da0f6f0",
        "5bb6540bbecb4e208da0f6f5",
        "5bb6540bbecb4e208da0f6f8",
        "5bb6540bbecb4e208da0f6f9",
        "5cffef5dbecb4e208d44ea65"
      ]);
    });
  });
});
