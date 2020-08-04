/*Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))*/
const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;
const Lesson = require("./Lesson");
const Resource = require("./Resource");
const User = require("./User");

const ResourceStatus = new Schema(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: "{PATH} is required!"
    },
    isTerminationPending: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ResourceStatus.plugin(require("mongoose-cursor-pagination").default);

const UserLessonSession = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!"
    },
    session: { type: String, required: "{PATH} is required!" },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson"
    },
    resourceStatuses: [ResourceStatus]
  },
  { timestamps: true }
);

UserLessonSession.index({ user: 1, session: 1 }, { unique: true });
UserLessonSession.plugin(require("./plugins/mongoose-to-id"));
UserLessonSession.plugin(require("mongoose-findorcreate"));
UserLessonSession.plugin(require("./plugins/mongoose-no-underscore-id"));
UserLessonSession.plugin(require("mongoose-cursor-pagination").default);

UserLessonSession.statics.findOneByUserAndSession = async function(
  user,
  session
) {
  if (!(user && user instanceof User)) {
    throw new Error("user must be a User instance");
  }
  if (!session && typeof session === "string") {
    throw new Error("session must be a non-empty string");
  }
  return await this.findOne({ user: user.id, session }).exec();
};

UserLessonSession.statics.isResourceTerminationPending = async function(
  user,
  session,
  resource
) {
  const lessSess = await this.findOneByUserAndSession(user, session);
  if (!lessSess) {
    return false;
  }
  const resourceId =
    resource instanceof Resource ? `${resource._id}` : `${resource}`;
  const rs = lessSess.resourceStatuses.find(
    x => `${x.resource}` === `${resourceId}`
  );
  return Boolean(rs && rs.isTerminationPending);
};

UserLessonSession.statics.setResourceTerminationPending = async function(
  user,
  session,
  resource,
  terminationPending = true
) {
  if (!(user && user instanceof User)) {
    throw new Error("user must be a User instance");
  }
  if (!(session && typeof session === "string")) {
    throw new Error("session must be a non-empty string");
  }
  const resourceId =
    resource instanceof Resource ? `${resource._id}` : `${resource}`;
  if (!resourceId) {
    throw new Error("resource must a string, ObjectId or Resource instance");
  }
  const lessSess =
    (await this.findOneByUserAndSession(user, session)) ||
    (await this.findOneAndUpdate(
      { user: user.id, session },
      {
        user: user.id,
        session
      },
      { upsert: true, new: true }
    ).exec());
  lessSess.resourceStatuses = Array.isArray(lessSess.resourceStatuses)
    ? lessSess.resourceStatuses
    : [];
  let rs = lessSess.resourceStatuses.find(
    x => `${x.resource}` === `${resourceId}`
  );
  if (rs) {
    rs.isTerminationPending = Boolean(terminationPending);
  } else {
    rs = {
      resource: new mongoose.Types.ObjectId(resourceId),
      isTerminationPending: Boolean(terminationPending)
    };
    lessSess.resourceStatuses.push(rs);
  }
  await lessSess.save();
  return lessSess;
};

UserLessonSession.statics.saveUserLessonSession = async function(
  user,
  session,
  lesson
) {
  if (!(user && user instanceof User)) {
    throw new Error("user must be a User instance");
  }
  if (!(lesson && lesson instanceof Lesson)) {
    throw new Error("lesson must be a Lesson instance");
  }
  if (!(session && typeof session === "string")) {
    throw new Error("session must be a non-empty string");
  }
  return await this.findOneAndUpdate(
    { user: user.id, session },
    {
      user: user.id,
      session,
      lesson: lesson.id
    },
    { upsert: true, new: true }
  ).exec();
};

module.exports = mongoose.model("UserLessonSession", UserLessonSession);
