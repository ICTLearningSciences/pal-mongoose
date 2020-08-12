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
const Cohort = require("Cohort");

describe("Cohort", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOrCreateForName", function() {
    it("gets a cohort", async () => {
      const cohort = await Cohort.findOrCreateForName("TestCohort");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("Test Cohort");
      expect(cohort.nameCanonical).to.eql("testcohort");
    });

    it("creates a new cohort", async () => {
      const cohort = await Cohort.findOrCreateForName("New Cohort");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("New Cohort");
      expect(cohort.nameCanonical).to.eql("newcohort");
    });

    it("is case-insensitive", async () => {
      await Cohort.findOrCreateForName("New Cohort");
      const cohort = await Cohort.findOrCreateForName("nEW cOHORT");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("New Cohort");
      expect(cohort.nameCanonical).to.eql("newcohort");
    });

    it("is space-insensitive", async () => {
      await Cohort.findOrCreateForName("New Cohort");
      const cohort = await Cohort.findOrCreateForName(" New C ohort ");
      expect(cohort).to.exist;
      expect(cohort.name).to.eql("New Cohort");
      expect(cohort.nameCanonical).to.eql("newcohort");
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await Cohort.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(3);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await Cohort.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].nameCanonical).to.eql("studycohort");
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await Cohort.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5ed82fb2a869c32825c74474"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].nameCanonical).to.eql("testcohort");
    });
  });
});
