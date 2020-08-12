/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
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

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await Goal.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(6);
      expect(results.hasMore).to.eql(false);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await Goal.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.hasMore).to.eql(true);
      expect(results.items[0].alias).to.eql("advancement-test-fc-e3");
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await Goal.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5b5a2cd69b1fafcf999d957e"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.hasMore).to.eql(true);
      expect(results.items[0].alias).to.eql("health-and-wellness");
    });
  });
});
