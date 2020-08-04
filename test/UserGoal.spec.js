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
    it("finds an initial page of items with a default limit", async () => {
      const results = await UserGoal.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(0);
      expect(results.hasMore).to.eql(false);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await UserGoal.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(0);
      expect(results.hasMore).to.eql(false);
    });
  });
});
