const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Goal = require("Goal");
const User = require("User");
const UserGoal = require("UserGoal");

describe("UserGoal", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("saveGoalAndFocus", function() {
    it("saves users goal and focus", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      expect(await UserGoal.findForUser(user)).to.not.exist;
      const goal = await Goal.findOneByIdOrAlias("advancement-test-fc-e3");
      await UserGoal.saveGoalAndFocus(user, goal._id, "technical-skills");
      const userGoal = await UserGoal.findForUser(user);
      expect(userGoal).to.exist;
      expect(userGoal).to.be.instanceof(UserGoal);
      expect(userGoal.activeGoal).to.eql(goal._id);
    });

    it("returns the new user goal", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("advancement-test-fc-e3");
      const userGoal = await UserGoal.saveGoalAndFocus(
        user,
        goal._id,
        "technical-skills"
      );
      expect(userGoal).to.exist;
      expect(userGoal).to.be.instanceof(UserGoal);
      expect(userGoal.activeGoal).to.eql(goal._id);
    });
  });

  describe("paginate", function() {
    it("gets items", async () => {
      const results = await UserGoal.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 99
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(0);
      expect(results.hasMore).to.eql(false);
    });
  });
});
