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
const Lesson = require("Lesson");
const User = require("User");
const UserLessonSession = require("UserLessonSession");

describe("UserLessonSession", () => {
  let lesson1 = null;
  let lesson2 = null;
  let lessonWithMultipleResources = null;
  let user1 = null;
  let user2 = null;
  const session1 = "session1";
  const session2 = "session2";

  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
    user1 = await User.findOne({ name: "larry" }).exec();
    user2 = await User.findOne({ name: "kcarr" }).exec();
    lesson1 = await Lesson.findOne({
      alias: "diode-action-diodes-tutorial"
    }).exec();
    lesson2 = await Lesson.findOne({
      alias: "diode-action-review-diode-current-flow"
    }).exec();
    lessonWithMultipleResources = await Lesson.findOne({
      alias: "diode-action-prerequisites"
    });
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("saveUserLessonSession", () => {
    it("returns a saved lesson for user and session", async () => {
      const saved = await UserLessonSession.saveUserLessonSession(
        user1,
        session1,
        lesson1
      );
      expect(saved).to.exist;
      expect(saved.user).to.eql(user1.id);
      expect(saved.session).to.eql(session1);
      expect(saved.lesson).to.eql(lesson1.id);
    });

    it("throws an error if user is undefined", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession();
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if user is a string", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession(`${user1.id}`);
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if user is an ObjectId", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession(user1.id);
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if user is not a User", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession({ _id: user1.id });
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if lesson is undefined", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession(user1, session1);
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if lesson is a string", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession(
          user1,
          session1,
          `${lesson1.id}`
        );
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if lesson is an ObjectId", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession(
          user1,
          session1,
          lesson1.id
        );
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if lesson is not a Lesson", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession({ _id: user1.id });
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });

    it("throws an error if session is undefined", async () => {
      let errorCaught = null;
      try {
        await UserLessonSession.saveUserLessonSession(
          user1,
          undefined,
          lesson1
        );
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.exist;
    });
  });

  describe("findOneByUserAndSession", () => {
    it("returns null when no lesson is saved for the user and session", async () => {
      expect(await UserLessonSession.findOneByUserAndSession(user1, session1))
        .to.not.exist;
    });

    it("returns lesson saved for a user and session", async () => {
      await UserLessonSession.saveUserLessonSession(user1, session1, lesson1);
      const found = await UserLessonSession.findOneByUserAndSession(
        user1,
        session1
      );
      expect(found.user).to.eql(user1.id);
      expect(found.session).to.eql(session1);
      expect(found.lesson).to.eql(lesson1.id);
    });

    it("isolates lesson saved for different sessions belonging to the same user", async () => {
      await UserLessonSession.saveUserLessonSession(user1, session1, lesson1);
      await UserLessonSession.saveUserLessonSession(user1, session2, lesson2);
      const found1 = await UserLessonSession.findOneByUserAndSession(
        user1,
        session1
      );
      expect(found1.user).to.eql(user1.id);
      expect(found1.session).to.eql(session1);
      expect(found1.lesson).to.eql(lesson1.id);
      const found2 = await UserLessonSession.findOneByUserAndSession(
        user1,
        session2
      );
      expect(found2.user).to.eql(user1.id);
      expect(found2.session).to.eql(session2);
      expect(found2.lesson).to.eql(lesson2.id);
    });

    it("isolates session saved for different users", async () => {
      await UserLessonSession.saveUserLessonSession(user1, session1, lesson1);
      await UserLessonSession.saveUserLessonSession(user2, session1, lesson2);
      const found1 = await UserLessonSession.findOneByUserAndSession(
        user1,
        session1
      );
      expect(found1.user).to.eql(user1.id);
      expect(found1.session).to.eql(session1);
      expect(found1.lesson).to.eql(lesson1.id);
      const found2 = await UserLessonSession.findOneByUserAndSession(
        user2,
        session1
      );
      expect(found2.user).to.eql(user2.id);
      expect(found2.session).to.eql(session1);
      expect(found2.lesson).to.eql(lesson2.id);
    });
  });

  describe("isSessionResourceTerminated", () => {
    it("returns false when the session is not found", async () => {
      expect(
        await UserLessonSession.isResourceTerminationPending(
          user1,
          session1,
          lessonWithMultipleResources.resources[0]
        )
      ).to.be.false;
    });

    it("returns false when the session is marked unterminated", async () => {
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[0],
        false
      );
      expect(
        await UserLessonSession.isResourceTerminationPending(
          user1,
          session1,
          lessonWithMultipleResources.resources[0]
        )
      ).to.be.false;
    });

    it("returns true when the session is marked terminated", async () => {
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[0],
        true
      );
      expect(
        await UserLessonSession.isResourceTerminationPending(
          user1,
          session1,
          lessonWithMultipleResources.resources[0]
        )
      ).to.be.true;
    });

    it("returns true when the session is marked unterminated and then terminated", async () => {
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[0],
        false
      );
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[0],
        true
      );
      expect(
        await UserLessonSession.isResourceTerminationPending(
          user1,
          session1,
          lessonWithMultipleResources.resources[0]
        )
      ).to.be.true;
    });

    it("supports a sequence of resources for one session", async () => {
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[0],
        true
      );
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[0],
        false
      );
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[1],
        true
      );
      expect(
        await UserLessonSession.isResourceTerminationPending(
          user1,
          session1,
          lessonWithMultipleResources.resources[1]
        )
      ).to.be.true;
      await UserLessonSession.setResourceTerminationPending(
        user1,
        session1,
        lessonWithMultipleResources.resources[1],
        false
      );
      expect(
        await UserLessonSession.isResourceTerminationPending(
          user1,
          session1,
          lessonWithMultipleResources.resources[1]
        )
      ).to.be.false;
    });
  });
});
