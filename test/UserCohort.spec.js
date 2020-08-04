/*Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))*/
const { expect } = require("chai");
const mongoUnit = require("mongo-unit");
const mongoose = require("mongoose");
const User = require("User");
const UserCohort = require("UserCohort");
const Goal = require("Goal");
const GoalCohort = require("GoalCohort");
const Cohort = require("Cohort");

describe("UserCohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findForUser", function() {
    it("gets the user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const userCohort = await UserCohort.findForUser(user);
      expect(userCohort).to.exist;
      expect(userCohort).to.be.instanceof(UserCohort);
      expect(userCohort.cohort).to.eql(
        mongoose.Types.ObjectId("5ed82fb2a869c32825c74474")
      );
    });

    it("returns nothing, if no user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      const userCohort = await UserCohort.findForUser(user);
      expect(userCohort).to.not.exist;
    });
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
      expect(userCohort.cohort).to.eql(
        mongoose.Types.ObjectId("5ed82fb2a869c32825c74474")
      );
    });

    it("updates user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const userCohort = await UserCohort.setUserCohort(
        user,
        "New Study Cohort"
      );
      const cohort = await Cohort.findOrCreateForName("New Study Cohort");
      expect(userCohort).to.exist;
      expect(userCohort).to.be.instanceof(UserCohort);
      expect(userCohort.cohort).to.eql(cohort.id);
    });

    it("gets current user cohort without updating", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );
      const curCohort = await UserCohort.findForUser(user);
      expect(curCohort).to.exist;
      expect(curCohort.cohort).to.eql(
        mongoose.Types.ObjectId("5ed82fb2a869c32825c74474")
      );
      const setCohort = await UserCohort.setUserCohort(user, "Study Cohort");
      expect(setCohort).to.exist;
      expect(setCohort.cohort).to.eql(
        mongoose.Types.ObjectId("5ed82fb2a869c32825c74474")
      );
      expect(curCohort.updatedAt).to.eql(setCohort.updatedAt);
    });

    it("removes user from previously joined cohorts that do not belong to new user cohort", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5dd88892c012321c14267156")
      );

      const goal = await Goal.findOneByIdOrAlias("5b5a2cd69b1fafcf999d957e");
      expect(await GoalCohort.findUserCohort(user, goal)).to.exist;
      await UserCohort.setUserCohort(user, "New Study Cohort");
      expect(await GoalCohort.findUserCohort(user, goal)).to.not.exist;
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await UserCohort.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.hasMore).to.eql(false);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await UserCohort.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.hasMore).to.eql(false);
    });
  });
});
