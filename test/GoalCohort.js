const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Goal = require("Goal");
const GoalCohort = require("GoalCohort");
const User = require("User");
const UserCohort = require("UserCohort");
const { ObjectId } = mongoose.Types;

describe("GoalCohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("find cohort by name", function() {
    it("returns cohort with given name", async () => {
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.findCohortByName("Study Cohort", goal);
      expect(cohort).to.have.property("name", "Study Cohort");
    });

    it("returns null if no cohort with name", async () => {
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.findCohortByName("AAAA", goal);
      expect(cohort).to.eql(null);
    });
  });

  describe("set user cohort", function() {
    it("leaves old cohorts", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      expect(await GoalCohort.findUserCohort(user, goal)).to.exist;
      await UserCohort.setUserCohort(user, "Study Cohort");
      expect(await GoalCohort.findUserCohort(user, goal)).to.not.exist;
    });

    it("joins named cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.membersMax).to.eql(30);
      expect(cohort.memberSlotsRemaning).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(1);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[0].icon).to.eql("LogoTeamRazorfish");
    });

    it("joins named cohort and leaves old cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const curCohort = await GoalCohort.findUserCohort(user, goal);
      expect(curCohort).to.exist;
      expect(curCohort.members).to.have.length(3);
      expect(curCohort.memberSlotsRemaning).to.eql(27);

      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.membersMax).to.eql(30);
      expect(cohort.memberSlotsRemaning).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(1);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[0].icon).to.eql("LogoTeamRazorfish");

      const oldCohort = await GoalCohort.findById(curCohort._id);
      expect(oldCohort.members).to.have.length(2);
      expect(oldCohort.memberSlotsRemaning).to.eql(28);
    });

    it("creates new named cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb65");
      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.membersMax).to.eql(30);
      expect(cohort.memberSlotsRemaning).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(6);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[1].name).to.eql("WaveMakers");
      expect(cohort.teams[2].name).to.eql("Hurricane");
      expect(cohort.teams[3].name).to.eql("ShipsAhoy");
      expect(cohort.teams[4].name).to.eql("RedSquad");
      expect(cohort.teams[5].name).to.eql("ElectricForce");
    });

    it("creates new team in named cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.createTeam(user, goal, "Study Team");
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.membersMax).to.eql(35);
      expect(cohort.memberSlotsRemaning).to.eql(34);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(1);
      expect(cohort.teams).to.have.length(2);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[1].name).to.eql("Study Team");
    });

    it("joins team in named cohort with code", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.joinCohort(user, goal, "rPT4wj_QT");
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.membersMax).to.eql(30);
      expect(cohort.memberSlotsRemaning).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(1);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[0].icon).to.eql("LogoTeamRazorfish");
    });
  });

  describe("create team", function() {
    it("throws an error if teamname is taken", async () => {
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
