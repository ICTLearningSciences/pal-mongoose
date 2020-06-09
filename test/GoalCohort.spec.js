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

  describe("joinOrCreate", function() {
    it("returns current named cohort without updating", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      await UserCohort.setUserCohort(user, "Study Cohort");
      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      const curCohort = await GoalCohort.joinOrCreate(user, goal);
      expect(curCohort).to.exist;
      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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
      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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
      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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
      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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

      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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
      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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
      const goalCohort = await GoalCohort.joinOrCreate(user, goal);
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

    it("generates and populates new teams when the GoalCohort for a named Cohort is full", async () => {
      // create new user, add them to the Cohort and then GoalCohort (1-slotRemaining)
      const user1 = await User.signUpWithCredentials(
        "user1",
        "password",
        "user1@test.com",
        "device"
      );
      await UserCohort.setUserCohort(user1, "Unjoinable");
      const goal = await Goal.findOneByIdOrAlias("5bb6540cdecb4e208da0fb64");
      const cohort = await Cohort.findForName("Unjoinable");
      const goalCohort1 = await GoalCohort.joinOrCreate(user1, goal);
      // expect user to have joined existing team, slots remaining is now 0
      expect(goalCohort1).to.exist;
      expect(goalCohort1.goal).to.eql(goal._id);
      expect(goalCohort1.cohort).to.eql(cohort._id);
      expect(goalCohort1.membersMax).to.eql(5);
      expect(goalCohort1.memberSlotsRemaining).to.eql(0);
      expect(goalCohort1.members).to.have.length(1);
      expect(goalCohort1.members[0].user).to.eql(user1._id);
      expect(goalCohort1.members[0].teamIndex).to.eql(0);
      expect(goalCohort1.teams).to.have.length(1);
      expect(goalCohort1.teams[0].name).to.eql("RedSquad");

      // create new user, add them to the Cohort and then GoalCohort (0-slotRemaining)
      const user2 = await User.signUpWithCredentials(
        "user2",
        "password",
        "user2@test.com",
        "device"
      );
      await UserCohort.setUserCohort(user2, "Unjoinable");
      const goalCohort2 = await GoalCohort.joinOrCreate(user2, goal);
      // expect that a new team was created and the user is in that team
      // expect that `memberSlotsRemaining` increases by team maxSize when the team was created
      expect(goalCohort2).to.exist;
      expect(goalCohort2.goal).to.eql(goal._id);
      expect(goalCohort2.cohort).to.eql(cohort._id);
      expect(goalCohort2.membersMax).to.eql(10);
      expect(goalCohort2.memberSlotsRemaining).to.eql(4);
      expect(goalCohort2.members).to.have.length(2);
      expect(goalCohort2.members[0].user).to.eql(user1._id);
      expect(goalCohort2.members[0].teamIndex).to.eql(0);
      expect(goalCohort2.members[1].user).to.eql(user2._id);
      expect(goalCohort2.members[1].teamIndex).to.eql(1);
      expect(goalCohort2.teams).to.have.length(2);
      expect(goalCohort2.teams[0].name).to.eql("RedSquad");
      expect(goalCohort2.teams[1].name).to.exist;

      // create new user, add them to the Cohort and then GoalCohort (4-slotRemaining)
      const user3 = await User.signUpWithCredentials(
        "user3",
        "password",
        "user3@test.com",
        "device"
      );
      await UserCohort.setUserCohort(user3, "Unjoinable");
      const goalCohort3 = await GoalCohort.joinOrCreate(user3, goal);
      // expect that user was assigned to same team as previous user
      // expect that memberSlotsRemaining decreases with each user added (would go back to 0 and then another new team)
      expect(goalCohort3).to.exist;
      expect(goalCohort3.goal).to.eql(goal._id);
      expect(goalCohort3.cohort).to.eql(cohort._id);
      expect(goalCohort3.membersMax).to.eql(10);
      expect(goalCohort3.memberSlotsRemaining).to.eql(3);
      expect(goalCohort3.members).to.have.length(3);
      expect(goalCohort3.members[0].user).to.eql(user1._id);
      expect(goalCohort3.members[0].teamIndex).to.eql(0);
      expect(goalCohort3.members[1].user).to.eql(user2._id);
      expect(goalCohort3.members[1].teamIndex).to.eql(1);
      expect(goalCohort3.members[2].user).to.eql(user3._id);
      expect(goalCohort3.members[2].teamIndex).to.eql(0);
      expect(goalCohort3.teams).to.have.length(2);
      expect(goalCohort3.teams[0].name).to.eql("RedSquad");
      expect(goalCohort3.teams[1].name).to.exist;
    });

    it("can create more than one unnamed cohort in the same goal", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const goal = await Goal.findOneByIdOrAlias("5bb6540cbecb4e208da0fb64");
      const cohort = await GoalCohort.joinOrCreate(user, goal);
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
      let goalCohort = await GoalCohort.joinOrCreate(user, goal);
      expect(goalCohort).to.exist;
      expect(goalCohort.cohort).to.eql(cohort._id);
      expect(goalCohort.goal).to.eql(goal._id);

      goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      goalCohort = await GoalCohort.joinOrCreate(user, goal);
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

  describe("sortUsersOntoTeams", function() {
    it("adds users onto teams in new cohort in correct order", async () => {
      const goal = await Goal.findOneByIdOrAlias("5bb6540cdecb4e208da0fb64");
      let users = [];
      for (var i = 0; i < 5; i++) {
        const user = await User.signUpWithCredentials(
          `user${i}`,
          `password${i}`,
          `user${i}@test.com`,
          `device${i}`
        );
        users.push(user);
        await UserCohort.setUserCohort(user, "Brand New Cohort");
      }

      // auto-add to team 0
      let goalCohort = await GoalCohort.joinOrCreate(users[0], goal);
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(29);
      expect(goalCohort.members).to.have.length(1);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.teams).to.have.length(6);

      // manually add to team 1
      goalCohort = await GoalCohort.joinWithInvite(
        users[1],
        goal,
        goalCohort.teams[1].inviteCode
      );
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(28);
      expect(goalCohort.members).to.have.length(2);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.members[1].teamIndex).to.eql(1);
      expect(goalCohort.teams).to.have.length(6);

      // auto-add to team 0
      goalCohort = await GoalCohort.joinOrCreate(users[2], goal);
      expect(goalCohort.membersMax).to.eql(30);
      expect(goalCohort.memberSlotsRemaining).to.eql(27);
      expect(goalCohort.members).to.have.length(3);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.members[1].teamIndex).to.eql(1);
      expect(goalCohort.members[2].teamIndex).to.eql(0);
      expect(goalCohort.teams).to.have.length(6);

      // create new team
      goalCohort = await GoalCohort.createTeam(users[3], goal, "New Team");
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(31);
      expect(goalCohort.members).to.have.length(4);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.members[1].teamIndex).to.eql(1);
      expect(goalCohort.members[2].teamIndex).to.eql(0);
      expect(goalCohort.members[3].teamIndex).to.eql(6);
      expect(goalCohort.teams).to.have.length(7);

      // auto add to team 1
      goalCohort = await GoalCohort.joinOrCreate(users[4], goal);
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(30);
      expect(goalCohort.members).to.have.length(5);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.members[1].teamIndex).to.eql(1);
      expect(goalCohort.members[2].teamIndex).to.eql(0);
      expect(goalCohort.members[3].teamIndex).to.eql(6);
      expect(goalCohort.members[4].teamIndex).to.eql(1);
      expect(goalCohort.teams).to.have.length(7);

      // remove user
      goalCohort = await GoalCohort.leaveCohort(users[3], goal);
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(31);
      expect(goalCohort.members).to.have.length(4);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.members[1].teamIndex).to.eql(1);
      expect(goalCohort.members[2].teamIndex).to.eql(0);
      expect(goalCohort.members[3].teamIndex).to.eql(1);
      expect(goalCohort.teams).to.have.length(7);

      // auto add to team 2
      goalCohort = await GoalCohort.joinOrCreate(users[3], goal);
      expect(goalCohort.membersMax).to.eql(35);
      expect(goalCohort.memberSlotsRemaining).to.eql(30);
      expect(goalCohort.members).to.have.length(5);
      expect(goalCohort.members[0].teamIndex).to.eql(0);
      expect(goalCohort.members[1].teamIndex).to.eql(1);
      expect(goalCohort.members[2].teamIndex).to.eql(0);
      expect(goalCohort.members[3].teamIndex).to.eql(1);
      expect(goalCohort.members[4].teamIndex).to.eql(2);
      expect(goalCohort.teams).to.have.length(7);
    });
  });
});
