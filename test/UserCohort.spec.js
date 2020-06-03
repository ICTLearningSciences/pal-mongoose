const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const User = require("User");
const UserCohort = require("UserCohort");
const Goal = require("Goal");
const GoalCohort = require("GoalCohort");

describe("UserCohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("setUserCohort", function() {
    it("sets user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      expect(await UserCohort.findForUser(user)).to.not.exist;
      await UserCohort.setUserCohort(user, "Study Cohort");
      const userCohort = await UserCohort.findForUser(user);
      expect(userCohort).to.exist;
      expect(userCohort).to.be.instanceof(UserCohort);
      expect(userCohort.cohort).to.eql("Study Cohort");
    });

    it("gets the user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const userCohort = await UserCohort.findForUser(user);
      expect(userCohort).to.exist;
      expect(userCohort).to.be.instanceof(UserCohort);
      expect(userCohort.cohort).to.eql("Study Cohort");
    });

    it("returns the new user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const userCohort = await UserCohort.setUserCohort(
        user,
        "New Study Cohort"
      );
      expect(userCohort).to.exist;
      expect(userCohort).to.be.instanceof(UserCohort);
      expect(userCohort.cohort).to.eql("New Study Cohort");
    });

    it("leaves old cohorts when setting new user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );

      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      expect(await GoalCohort.findUserCohort(user, goal)).to.exist;
      await UserCohort.setUserCohort(user, "New Study Cohort");
      expect(await GoalCohort.findUserCohort(user, goal)).to.not.exist;
    });
  });
});
