const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
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

  describe("find cohort by name", function() {
    it("returns cohort with given name", async () => {
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.findCohortByName("Study Cohort", goal);
      expect(cohort).to.have.property("name", "Study Cohort");
      expect(cohort).to.have.property("nameCanonical", "studycohort");
    });

    it("is not case-sensitive", async () => {
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.findCohortByName("StUdy coHorT", goal);
      expect(cohort).to.have.property("name", "Study Cohort");
      expect(cohort).to.have.property("nameCanonical", "studycohort");
    });

    it("is not space-sensitive", async () => {
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.findCohortByName(
        " St   udy  C o h ort",
        goal
      );
      expect(cohort).to.have.property("name", "Study Cohort");
      expect(cohort).to.have.property("nameCanonical", "studycohort");
    });

    it("returns null if no cohort with name", async () => {
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const cohort = await GoalCohort.findCohortByName("AAAA", goal);
      expect(cohort).to.eql(null);
    });
  });

  describe("join or create cohort", function() {
    it("joins a named cohort, if assigned user cohort", async () => {
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
      expect(cohort.memberSlotsRemaining).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(1);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[0].icon).to.eql("LogoTeamRazorfish");
    });

    it("joins an unnamed cohort, if not assigned user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5bb6540cdecb4e208da0fb64");
      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.name).to.eql(null);
      expect(cohort.nameCanonical).to.eql(null);
    });

    it("joins a named cohort and leaves old cohort, if in a different cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const curCohort = await GoalCohort.findUserCohort(user, goal);
      expect(curCohort).to.exist;
      expect(curCohort.members).to.have.length(3);
      expect(curCohort.memberSlotsRemaining).to.eql(27);

      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.membersMax).to.eql(30);
      expect(cohort.memberSlotsRemaining).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(1);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[0].icon).to.eql("LogoTeamRazorfish");

      const oldCohort = await GoalCohort.findById(curCohort._id);
      expect(oldCohort.members).to.have.length(2);
      expect(oldCohort.memberSlotsRemaining).to.eql(28);
    });

    it("creates a new named cohort, if does not exist", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb65");
      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Study Cohort");
      expect(cohort.nameCanonical).to.eql("studycohort");
      expect(cohort.membersMax).to.eql(30);
      expect(cohort.memberSlotsRemaining).to.eql(29);
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

    it("fails to join a named cohort, if no available space", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        await UserCohort.setUserCohort(user, "Test Cohort");
        const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
        await GoalCohort.joinOrCreateCohort(user, goal);
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "All teams in cohort Test Cohort are full. Please create a new team to join."
      );
      expect(expectedErr.status).to.equal(409);
    });

    it("can create more than one unnamed cohort in same goal", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      const cohort = await GoalCohort.joinOrCreateCohort(user, goal);
      expect(cohort).to.exist;
      expect(cohort.name).to.eql(null);
      expect(cohort.nameCanonical).to.eql(null);
      expect(cohort.id).to.not.eql("5df95a108878787d7708ec54");
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
      expect(cohort.memberSlotsRemaining).to.eql(34);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(1);
      expect(cohort.teams).to.have.length(2);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[1].name).to.eql("Study Team");
    });

    it("creates new team in named cohort that has more than 6 teams and 0 slots remaining", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Test Cohort");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      let cohort = await GoalCohort.createTeam(user, goal, "Test Team");
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Test Cohort");
      expect(cohort.membersMax).to.eql(35);
      expect(cohort.memberSlotsRemaining).to.eql(4);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(6);
      expect(cohort.teams).to.have.length(7);
      expect(cohort.teams[6].name).to.eql("Test Team");
      expect(cohort.teams[6].icon).to.eql("LogoTeamRazorfish");

      cohort = await GoalCohort.createTeam(user, goal, "Test Team 2");
      expect(cohort).to.exist;
      expect(cohort.goal).to.eql(goal._id);
      expect(cohort.name).to.eql("Test Cohort");
      expect(cohort.membersMax).to.eql(40);
      expect(cohort.memberSlotsRemaining).to.eql(9);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(7);
      expect(cohort.teams).to.have.length(8);
      expect(cohort.teams[7].name).to.eql("Test Team 2");
      expect(cohort.teams[7].icon).to.eql("LogoTeamZephyr");
    });
  });

  describe("join team with invite code", function() {
    it("joins team in named cohort", async () => {
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
      expect(cohort.memberSlotsRemaining).to.eql(29);
      expect(cohort.members).to.have.length(1);
      expect(cohort.members[0].user).to.eql(user._id);
      expect(cohort.members[0].teamIndex).to.eql(0);
      expect(cohort.teams).to.have.length(1);
      expect(cohort.teams[0].name).to.eql("Minnows");
      expect(cohort.teams[0].icon).to.eql("LogoTeamRazorfish");
    });

    it("fails to join team, if no available space", async () => {
      let expectedErr = null;
      try {
        const user = await User.findById(
          mongoose.Types.ObjectId("5dd88892c012321c14267155")
        );
        const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
        await GoalCohort.joinCohort(user, goal, "lTQ2Uf_LJ");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
      expect(expectedErr.message).to.equal(
        "The team cannot accept any more members"
      );
      expect(expectedErr.status).to.equal(409);
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
  });
});
