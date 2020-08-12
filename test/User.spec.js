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
const User = require("User");

describe("User", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findActiveById", function() {
    it("finds one user by id string", async () => {
      const user = await User.findActiveById("5dd88892c012321c14267155");
      expect(user.id).to.eql(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      expect(user.name).to.eql("kcarr");
      expect(user.email).to.eql("kcarr@ict.usc.edu");
    });

    it("finds one user by ObjectId", async () => {
      const user = await User.findActiveById(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      expect(user.id).to.eql(
        mongoose.Types.ObjectId("5dd88892c012321c14267155")
      );
      expect(user.name).to.eql("kcarr");
      expect(user.email).to.eql("kcarr@ict.usc.edu");
    });

    it("does not return a user for an existing user that is marked deleted", async () => {
      const user = await User.findById(
        mongoose.Types.ObjectId("5bf4a366becb4e208de99099")
      ).exec();
      expect(user.name).to.eql("DeletedUser");
      expect(await User.findActiveById("5bf4a366becb4e208de99099")).to.not
        .exist;
    });
  });

  describe("findActive", function() {
    it("finds all users EXCEPT deleted users", async () => {
      const users = await User.findActive({});
      expect(users.find(u => u.name === "kcarr").name).to.eql("kcarr");
      expect(users.find(u => u.name === "larry").name).to.eql("larry");
      expect(users.find(u => u.name === "Expert").name).to.eql("Expert");
      expect(users.find(u => u.name === "DeletedUser")).to.not.exist;
    });

    it("applies a query like the default mongoose find function", async () => {
      const users = await User.findActive({ name: "larry" });
      expect(users[0].name).to.eql("larry");
      expect(users.length).to.eql(1);
    });
  });

  describe("findOneActive", function() {
    it("applies a query like the default mongoose find function", async () => {
      const user = await User.findOneActive({
        name: { $in: ["kcarr", "larry"] }
      });
      expect(user.name).to.eql("kcarr");
    });

    it("never returns a deleted user", async () => {
      const user = await User.findOneActive({
        name: "DeletedUser"
      });
      expect(user).to.not.exist;
    });
  });

  describe("isUserNameAvailable", function() {
    it("determines a user name belonging to an active user is unavailable", async () => {
      const available = await User.isUserNameAvailable("kcarr");
      expect(available).to.eql(false);
    });

    it("determines an untaken user name is available", async () => {
      const available = await User.isUserNameAvailable("untakenname");
      expect(available).to.eql(true);
    });

    it("determines a user name taken by a deleted user is unavailable", async () => {
      const available = await User.isUserNameAvailable("DeletedUser");
      expect(available).to.eql(false);
    });
  });

  describe("isEmailAvailable", function() {
    it("determines an email assigned to an active user is unavailable", async () => {
      const available = await User.isEmailAvailable("kcarr@ict.usc.edu");
      expect(available).to.eql(false);
    });

    it("determines an email not assigned to any user is available", async () => {
      const available = await User.isEmailAvailable("kcarr100@ict.usc.edu");
      expect(available).to.eql(true);
    });

    it("determines an email assigned to a deleted user is unavailable", async () => {
      const available = await User.isEmailAvailable(
        "deleteduser@pal.ict.usc.edu"
      );
      expect(available).to.eql(false);
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await User.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(4);
      expect(results.hasMore).to.eql(false);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await User.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].nameLower).to.eql("expert");
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await User.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5bf4a366becb4e208de99092"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].nameLower).to.eql("deleteduser");
      expect(results.hasMore).to.eql(true);
    });
  });
});
