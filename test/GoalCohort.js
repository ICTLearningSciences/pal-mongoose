const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Goal = require("Goal");
const GoalCohort = require("GoalCohort");
const User = require("User");

describe("GoalCohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("create team", function() {
    it.only("throws an error if teamname is taken", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb65");
        await GoalCohort.createTeam(user, goal, "RedSquad");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "Cohort already has a team RedSquad. Please pick a different name"
      );
      expect(expectedErr.status).to.equal(409);
    });
  });
});
