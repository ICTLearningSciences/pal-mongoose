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
const Lesson = require("Lesson");
const Topic = require("Topic");

describe("Topic", function() {
  beforeEach(async () => {
    await mongoUnit.load(require("./fixtures/mongodb/data-default.js"));
  });

  afterEach(async () => {
    await mongoUnit.drop();
  });

  describe("findOneByIdOrAlias", function() {
    it("finds one by alias", async () => {
      const item = await Topic.findOneByIdOrAlias("diode-action");
      expect(item).to.have.property("name", "Diode Action");
    });

    it("finds one by id string", async () => {
      const item = await Topic.findOneByIdOrAlias("5bb6540bbecb4e208da0f6e7");
      expect(item).to.have.property("alias", "diode-action");
    });

    it("finds one by id object", async () => {
      const item = await Topic.findOneByIdOrAlias(
        mongoose.Types.ObjectId("5bb6540bbecb4e208da0f6e7")
      );
      expect(item).to.have.property("alias", "diode-action");
    });

    it("verify attribute relevance exists", async () => {
      const item = await Topic.findOneByIdOrAlias("c-school-entrance-capstone");
      expect(item.attributeRelevance[0].name).to.equal("variable1");
      expect(item.attributeRelevance[0].value).to.equal(.5);
    });
  });

  describe("findLessons", function() {
    it("finds lessons belonging to a topic instance", async () => {
      const topic = await Topic.findOneByIdOrAlias("diode-action");
      const lessons = await topic.findLessons();
      expect(lessons.length).to.eql(4);
    });

    it("orders returned lessons by the ord field", async () => {
      const topic = await Topic.findOneByIdOrAlias("diode-action");
      const lessons = await topic.findLessons();
      expect(lessons[0]).to.have.property(
        "alias",
        "diode-action-prerequisites"
      );
      expect(lessons[0]).to.have.property("ord", 0);
      expect(lessons[1]).to.have.property(
        "alias",
        "diode-action-diodes-tutorial"
      );
      expect(lessons[1]).to.have.property("ord", 1);
      expect(lessons[2]).to.have.property(
        "alias",
        "diode-action-review-diode-current-flow"
      );
      expect(lessons[2]).to.have.property("ord", 2);
      expect(lessons[3]).to.have.property(
        "alias",
        "diode-action-review-normal-diode-breakdown-mode"
      );
      expect(lessons[3]).to.have.property("ord", 3);
    });

    it("excludes lessons marked deleted from the result", async () => {
      const topic = await Topic.findOneByIdOrAlias("diode-action");
      const deletedLesson = await Lesson.findOne({
        _id: mongoose.Types.ObjectId("5bb6540cbecb4e208da0f9b5")
      });
      expect(deletedLesson.topic).to.eql(topic._id);
      expect(deletedLesson).to.have.property("deleted", true);
      const lessons = await topic.findLessons();
      expect(lessons.find(i => i._id === deletedLesson._id)).to.not.exist;
    });
  });

  describe("paginate", function() {
    it("finds an initial page of items with a default limit", async () => {
      const results = await Topic.paginate(
        {},
        {
          sort: { _id: 1 }
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(20);
      expect(results.hasMore).to.eql(true);
    });

    it("finds an initial page of items with a specified limit", async () => {
      const results = await Topic.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("c-school-entrance-capstone");
      expect(results.hasMore).to.eql(true);
    });

    it("finds a subsequent page of items with a speficied limit, starting from cursor", async () => {
      const results = await Topic.paginate(
        {},
        {
          sort: { _id: 1 },
          limit: 1,
          startingAfter: "5bb6540bbecb4e208da0f6dd"
        }
      );
      expect(results).to.exist;
      expect(results.items).to.exist;
      expect(results.items.length).to.eql(1);
      expect(results.items[0].alias).to.eql("navy-general-information");
      expect(results.hasMore).to.eql(true);
    });
  });
});
