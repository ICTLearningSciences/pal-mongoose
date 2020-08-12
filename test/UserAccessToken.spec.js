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
const UserAccessToken = require("UserAccessToken");

describe("UserAccessToken", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("loginWithCredentials", function() {
    it("succeeds when username and password are valid", async () => {
      const token = await UserAccessToken.loginWithCredentials("kcarr", "asdf");
      expect(token).to.exist;
      const user = await User.findOne({ name: "kcarr" });
      expect(token.user.id).to.eql(user._id);
    });

    it("succeeds when email and password are valid", async () => {
      const token = await UserAccessToken.loginWithCredentials(
        "kcarr@ict.usc.edu",
        "asdf"
      );
      expect(token).to.exist;
      const user = await User.findOne({ name: "kcarr" });
      expect(token.user.id).to.eql(user._id);
    });

    it("updates last login on success", async () => {
      const beforeLogin = new Date();
      const token = await UserAccessToken.loginWithCredentials("kcarr", "asdf");
      expect(token).to.exist;
      const user = await User.findOne({ name: "kcarr" });
      expect(user.lastLoginAt).to.be.greaterThan(beforeLogin);
    });

    it("throws an error if username not found", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.loginWithCredentials("noneexistantuser", "asdf");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });

    it("throws an error if password is invalid", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.loginWithCredentials("kcarr", "wrongpassword");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });
  });

  describe("signUpWithCredentials", function() {
    it("succeeds when username, password, and email are valid", async () => {
      const token = await UserAccessToken.signUpWithCredentials(
        "newuser1",
        "asdf",
        "someemail@domain.com"
      );
      expect(token).to.exist;
      const user = await User.findOne({ name: "newuser1" });
      expect(token.user.id).to.eql(user._id);
    });

    it("succeeds across multiple registrations (no unique-index problems)", async () => {
      const token = await UserAccessToken.signUpWithCredentials(
        "newuser1",
        "asdf",
        "someemail@domain.com"
      );
      expect(token).to.exist;
      const user = await User.findOne({ name: "newuser1" });
      expect(token.user.id).to.eql(user._id);
      const token2 = await UserAccessToken.signUpWithCredentials(
        "newuser2",
        "asdf",
        "someemail2@domain.com"
      );
      expect(token2).to.exist;
      const user2 = await User.findOne({ name: "newuser2" });
      expect(token2.user.id).to.eql(user2._id);
    });

    it("updates lastLoginAt on success", async () => {
      const before = new Date();
      const token = await UserAccessToken.signUpWithCredentials(
        "newuser1",
        "asdf",
        "someemail@domain.com"
      );
      expect(token).to.exist;
      const user = await User.findOne({ name: "newuser1" });
      expect(user.lastLoginAt).to.be.greaterThan(before);
    });

    it("updates createdAt login on success", async () => {
      const before = new Date();
      const token = await UserAccessToken.signUpWithCredentials(
        "newuser1",
        "asdf",
        "someemail@domain.com"
      );
      expect(token).to.exist;
      const user = await User.findOne({ name: "newuser1" });
      expect(user.createdAt).to.be.greaterThan(before);
    });

    it("throws an error if username not passed", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.signUpWithCredentials();
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });

    it("throws an error if password not passed", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.signUpWithCredentials("someusername");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });

    it("throws an error if email not passed", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.signUpWithCredentials(
          "someusername",
          "somepassword"
        );
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });

    it("throws an error if username is taken", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.signUpWithCredentials(
          "kcarr",
          "asdf",
          "someemail@domain.com"
        );
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });

    it("throws an error if email is taken", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.signUpWithCredentials(
          "somenewusername",
          "asdf",
          "kcarr@ict.usc.edu"
        );
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });
  });

  describe("authenticate", function() {
    it("succeeds with valid auth token", async () => {
      const token = await UserAccessToken.authenticate(
        "82189440-16fc-11ea-996e-321c14267155"
      );
      expect(token).to.exist;
      const user = await User.findOne({ name: "kcarr" });
      expect(token.user.id).to.eql(user._id);
    });

    it("succeeds with auth token returned by login", async () => {
      const loginToken = await UserAccessToken.loginWithCredentials(
        "kcarr",
        "asdf"
      );
      const token = await UserAccessToken.authenticate(loginToken.accessToken);
      expect(token).to.exist;
      const user = await User.findOne({ name: "kcarr" });
      expect(token.user.id).to.eql(user._id);
    });

    it("succeeds with auth token returned by signup", async () => {
      const signupToken = await UserAccessToken.signUpWithCredentials(
        "newuser1",
        "asdf",
        "someemail@domain.com"
      );
      const token = await UserAccessToken.authenticate(signupToken.accessToken);
      expect(token).to.exist;
      const user = await User.findOne({ name: "newuser1" });
      expect(token.user.id).to.eql(user._id);
    });

    it("throws an error if token is invalid", async () => {
      let expectedErr = null;
      try {
        await UserAccessToken.authenticate("someinvalidtoken");
      } catch (err) {
        expectedErr = err;
      }
      expect(expectedErr).to.exist;
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await UserAccessToken.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(3);
      expect(results.hasMore).to.eql(false);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await UserAccessToken.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0]._id).to.eql(
        mongoose.Types.ObjectId("5bf4a366becb4e208de99091")
      );
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await UserAccessToken.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5bf4a366becb4e208de99091"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0]._id).to.eql(
        mongoose.Types.ObjectId("5bf4a366becb4e208de99093")
      );
      expect(results.hasMore).to.eql(true);
    });
  });
});
