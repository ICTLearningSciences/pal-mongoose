const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const Cohort = require("Cohort");
const Goal = require("Goal");
const GoalCohort = require("GoalCohort");
const User = require("User");
const UserCohort = require("UserCohort");

describe("GoalCohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("joinOrCreateCohort", function() {
    it("returns current named cohort without updating", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const curCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(curCohort).to.exist;
      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort._id).to.eql(curCohort._id);
      expect(goalCohort.updatedAt).to.eql(curCohort.updatedAt);
    });

    it("returns current unnamed cohort without updating", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const curCohort = await GoalCohort.findUserCohort(user, goal);
      expect(curCohort).to.exist;
      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort._id).to.eql(curCohort._id);
      expect(goalCohort.updatedAt).to.eql(curCohort.updatedAt);
    });

    it("joins a named cohort, if assigned a user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      const cohort = await Cohort.findForName("Study Cohort");
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(29);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.teams).to.have.length(1);
      expect(goalCohort.teams[0].name).to.eql("Minnows");
      expect(goalCohort.teams[0].icon).to.eql("LogoTeamRazorfish");
    });

    it("joins an unnamed cohort, if not assigned a user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5bb6540cdecb4e208da0fb64");
      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort.cohort).to.not.exist;
    });

    it("joins a named cohort and leaves old cohort, if assigned a user cohort but in a different cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const curCohort = await GoalCohort.findUserCohort(user, goal);
      const cohort = await Cohort.findForName("Study Cohort");
      expect(curCohort).to.exist;
      expect(curCohort.members).to.have.length(3);
      expect(curCohort.memberSlotsRemaining).to.eql(27);

      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort.id);
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(29);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.teams).to.have.length(1);
      expect(goalCohort.teams[0].name).to.eql("Minnows");
      expect(goalCohort.teams[0].icon).to.eql("LogoTeamRazorfish");

      const oldCohort = await GoalCohort.findById(curCohort._id);
      expect(oldCohort.members).to.have.length(2);
      expect(oldCohort.memberSlotsRemaining).to.eql(28);
    });

    it("creates a new named cohort, if assigned a user cohort but does not exist", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb65");
      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      const cohort = await Cohort.findForName("Study Cohort");
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(29);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.teams).to.have.length(6);
      expect(goalCohort.teams[0].name).to.eql("Minnows");
      expect(goalCohort.teams[1].name).to.eql("WaveMakers");
      expect(goalCohort.teams[2].name).to.eql("Hurricane");
      expect(goalCohort.teams[3].name).to.eql("ShipsAhoy");
      expect(goalCohort.teams[4].name).to.eql("RedSquad");
      expect(goalCohort.teams[5].name).to.eql("ElectricForce");
    });

    it("creates and joins a new team in a named cohort, if assigned a user cohort but no available space", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Test Cohort");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      const cohort = await Cohort.findForName("Test Cohort");
      const goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(4);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(6);
      expect(goalCohort.teams).to.have.length(7);
      expect(goalCohort.teams[0].name).to.eql("Minnows");
      expect(goalCohort.teams[1].name).to.eql("WaveMakers");
      expect(goalCohort.teams[2].name).to.eql("Hurricane");
      expect(goalCohort.teams[3].name).to.eql("ShipsAhoy");
      expect(goalCohort.teams[4].name).to.eql("RedSquad");
      expect(goalCohort.teams[5].name).to.eql("ElectricForce");
      expect(goalCohort.teams[6].name).to.not.eql("");
    });

    it("can create more than one unnamed cohort in the same goal", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.cohort).to.not.exist;
      expect(cohort.id).to.not.eql("5df95a108878787d7708ec54");
    });

    it("allows a cohort name to be used exactly once per goal", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "New Cohort");
      const cohort = await Cohort.findForName("New Cohort");
      let goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      let goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.goal).to.eql(goal._id);

      goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      goalCohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.goal).to.eql(goal._id);
    });
  });

  describe("createTeam", function() {
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

    it("creates new team in named cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const goalCohort = await GoalCohort.createTeam(user, goal, "Study Team");
      const cohort = await Cohort.findForName("Study Cohort");
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(34);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(1);
      expect(goalCohort.teams).to.have.length(2);
      expect(goalCohort.teams[0].name).to.eql("Minnows");
      expect(goalCohort.teams[1].name).to.eql("Study Team");
    });

    it("creates new team in named cohort that has more than 6 teams and 0 slots remaining", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Test Cohort");
      const cohort = await Cohort.findForName("Test Cohort");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      let goalCohort = await GoalCohort.createTeam(user, goal, "Test Team");
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(4);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(6);
      expect(goalCohort.teams).to.have.length(7);
      expect(goalCohort.teams[6].name).to.eql("Test Team");
      expect(goalCohort.teams[6].icon).to.eql("LogoTeamRazorfish");

      goalCohort = await GoalCohort.createTeam(user, goal, "Test Team 2");
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(40);
      expect(goalCohort.memberSlotsRemaining).to.eql(9);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(7);
      expect(goalCohort.teams).to.have.length(8);
      expect(goalCohort.teams[7].name).to.eql("Test Team 2");
      expect(goalCohort.teams[7].icon).to.eql("LogoTeamZephyr");
    });
  });

  describe("joinWithInvite", function() {
    it("joins team in named cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const cohort = await Cohort.findForName("Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const goalCohort = await GoalCohort.joinWithInvite(
        user,
        goal,
        "lUYoW3tLo"
      );
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(29);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].user).to.eql(user._id);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.teams).to.have.length(1);
      expect(goalCohort.teams[0].name).to.eql("Minnows");
      expect(goalCohort.teams[0].icon).to.eql("LogoTeamRazorfish");
    });

    it("joins team in un-named cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const goalCohort = await GoalCohort.joinWithInvite(
        user,
        goal,
        "lTQ2Uf_LJ"
      );
      expect(goalCohort).to.exist;
      expect(goalCohort.goal).to.eql(goal._id);
      expect(goalCohort.cohort).to.not.exist;
    });

    it("fails if team is in named cohort and user is not", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
        await GoalCohort.joinWithInvite(user, goal, "lUYoW3tLo");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "The team is in a different cohort than the one you are assigned to"
      );
      expect(expectedErr.status).to.equal(409);
    });

    it("fails if user is in named cohort and team is not", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        await UserCohort.setUserCohort(user, "Study Cohort");
        const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
        await GoalCohort.joinWithInvite(user, goal, "rPT4wj_QT");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "The team is in a different cohort than the one you are assigned to"
      );
      expect(expectedErr.status).to.equal(409);
    });

    it("fails if user and team are in different named cohorts", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        await UserCohort.setUserCohort(user, "New Study Cohort");
        const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
        await GoalCohort.joinWithInvite(user, goal, "lUYoW3tLo");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "The team is in a different cohort than the one you are assigned to"
      );
      expect(expectedErr.status).to.equal(409);
    });

    it("fails to join team, if no available space", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
        await GoalCohort.joinWithInvite(user, goal, "lTQ2Uf_LJ");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "The cohort cannot accept any more members"
      );
      expect(expectedErr.status).to.equal(409);
    });
  });
});
