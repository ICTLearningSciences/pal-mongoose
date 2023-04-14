/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
const { promisify } = require("es6-promisify");
const bcrypt = require("bcrypt-nodejs");
const bcryptHash = promisify(bcrypt.hash);
const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;
const UserKnowledgeComponent = require("./UserKnowledgeComponent.js");

const User = new Schema(
  {
    creationDeviceId: { type: String, index: true }, // device id passed when user was created
    nameLower: {
      type: String,
      required: "{PATH} is required!",
      unique: true,
      lowercase: true,
      trim: true
    },
    name: { type: String, required: "{PATH} is required!" },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lastLoginAt: { type: Date, default: Date.now },
    lastDeviceId: { type: String, index: true }
  },
  { timestamps: true }
);

User.plugin(require("./plugins/mongoose-to-id"));
User.plugin(require("mongoose-findorcreate"));
User.plugin(require("./plugins/mongoose-no-underscore-id"));
User.plugin(require("mongoose-cursor-pagination").default);

/**
 * Basic findById
 *
 * @param {ObjectId} userId
 * @param {function(err,user)} callback - (optional)
 * @returns {undefined|Promise} promise if no callback passed
 */
User.statics.findActiveById = function(userId, callback) {
  const userModel = this;

  const promise = new Promise((resolve, reject) => {
    userModel.findOne({ _id: userId }, (err, user) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });

  if (!callback) {
    return promise;
  }

  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

/**
 * Basic find
 */
User.statics.findActive = function(query) {
  const userModel = this;
  query = query || {};
  return new Promise((resolve, reject) => {
    userModel.find({ ...query }, (err, user) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
};

User.statics.findOneActive = function(query) {
  const userModel = this;
  query = query || {};
  return new Promise((resolve, reject) => {
    userModel.findOne({ ...query }, (err, user) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
};

User.statics.isUserNameAvailable = function(userName, callback) {
  const userModel = this;
  const promise = new Promise((resolve, reject) => {
    userModel
      .findOne({ nameLower: userName.toLowerCase() })
      .then(user => resolve(!user))
      .catch(err => reject(err));
  });
  if (!callback) {
    return promise;
  }
  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

User.statics.isEmailAvailable = function(email, callback) {
  const userModel = this;
  const promise = new Promise((resolve, reject) => {
    userModel.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return reject(err);
      }
      return resolve(!user);
    });
  });
  if (!callback) {
    return promise;
  }
  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

/**
 * Find the user with given userId, mark them as logged in,
 * and then return user via callback
 * @param {string} userId
 * @param {string} deviceId - the device id to login
 * @param {function(err, user)} callback
 */
User.statics.login = function(userId, deviceId, callback) {
  const userModel = this;
  userId = userModel.toId(userId);
  userModel.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return callback(err);
    }

    user._login(deviceId); // don't wait for save callback to return

    return callback(null, user);
  });
};

/**
 * Finds and returns the user having the passed access token.
 *
 * @param {string} accessToken
 * @param {function(err, user)} callback
 */
User.statics.authenticate = function(accessToken, callback) {
  const self = this;

  mongoose
    .model("UserAccessToken")
    .authenticate(accessToken, function(err, uat) {
      if (err) {
        return callback(err);
      }
      if (!uat) {
        return callback();
      }
      const userId = self.toId(uat.user);
      return self.findOne({ _id: userId }, callback);
    });
};

User.statics.deleteAccount = function(userNameOrEmail, password, callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    if (!userNameOrEmail) {
      return reject(new Error("must pass a valid username"));
    }
    if (!password) {
      return reject(new Error("must pass a valid password"));
    }
    self
      .findOne({
        $or: [
          { email: userNameOrEmail.toLowerCase() },
          { nameLower: userNameOrEmail.toLowerCase() }
        ]
      })
      .then(user => {
        if (!user) {
          const err = new Error("Username not found.");
          err.status = 401;
          return reject(err);
        }
        bcrypt.compare(password, user.password, function(err, result) {
          if (!result) {
            const retErr = new Error("Incorrect password.");
            retErr.status = 401;
            return reject(retErr);
          }
          Promise.all([
            mongoose.model("User").deleteOne({ _id: user._id }),
            mongoose.model("UserAccessToken").deleteOne({ user: user._id }),
            mongoose.model("UserGoal").deleteOne({ user: user._id }),
            mongoose.model("UserCohort").deleteOne({ user: user._id }),
            mongoose.model("UserLessonSession").deleteMany({ user: user._id }),
            mongoose
              .model("UserKnowledgeComponent")
              .deleteMany({ user: user.id })
          ]).then(() => {
            return resolve(true);
          });
        });
      })
      .catch(err => reject(err));
  });
  if (!callback) {
    return promise;
  }
  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

User.statics.loginWithCredentials = function(
  userNameOrEmail,
  password,
  deviceId,
  callback
) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    if (!userNameOrEmail) {
      return reject(new Error("must pass a valid username"));
    }
    if (!password) {
      return reject(new Error("must pass a valid password"));
    }
    self
      .findOne({
        $or: [
          { email: userNameOrEmail.toLowerCase() },
          { nameLower: userNameOrEmail.toLowerCase() }
        ]
      })
      .then(user => {
        if (!user) {
          const err = new Error("Username not found.");
          err.status = 401;
          return reject(err);
        }
        bcrypt.compare(password, user.password, function(err, result) {
          if (!result) {
            const retErr = new Error("Incorrect password.");
            retErr.status = 401;
            return reject(retErr);
          }
          user._login(deviceId);
          return resolve(user);
        });
      })
      .catch(err => reject(err));
  });
  if (!callback) {
    return promise;
  }
  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

User.statics.signUpWithCredentials = function(
  userName,
  password,
  email,
  deviceId,
  callback
) {
  const userModel = this;
  const promise = new Promise((resolve, reject) => {
    if (!userName) {
      return reject(new Error("must pass a valid userName"));
    }
    if (!password) {
      return reject(new Error("must pass a valid password"));
    }
    if (!email) {
      return reject(new Error("must pass a valid email"));
    }
    userModel
      .findOne({
        $or: [
          { email: email.toLowerCase() },
          { nameLower: userName.toLowerCase() }
        ]
      })
      .then(user => {
        if (user) {
          const err = new Error("Username or email already exists.");
          err.status = 401;
          return reject(err);
        }
        bcryptHash(password, null, null)
          .then(hash => {
            user = new userModel({
              creationDeviceId: deviceId,
              lastDeviceId: deviceId,
              lastLoginAt: new Date(),
              name: userName,
              nameLower: userName.toLowerCase(),
              password: hash,
              email: email.toLowerCase()
            });
            user
              .save()
              .then(user => resolve(user))
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
  if (!callback) {
    return promise;
  }
  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

User.statics.resetPassword = function(username, password, callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    if (!username) {
      return reject(new Error("must pass a valid username"));
    }
    if (!reject) {
      return callback(new Error("must pass a valid password"));
    }
    self
      .findOne({ nameLower: username.toLowerCase() })
      .then(user => {
        if (!user) {
          const err = new Error("User could not be found.");
          err.status = 401;
          return reject(err);
        }
        bcryptHash(password, null, null)
          .then(hash => {
            user._updatePassword(hash);
            return resolve(user);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
  if (!callback) {
    return promise;
  }
  promise
    .then(pRes => {
      return callback(null, pRes);
    })
    .catch(pErr => {
      return callback(pErr);
    });
};

/**
 * updates the users lastLoginAt and lastDeviceId
 * as we want for each time a user logs in.
 * @param {string} deviceId - the device id to login
 * @param {function(err, user)} callback
 */
User.methods._login = function(deviceId, callback) {
  const user = this;
  user.lastLoginAt = new Date();
  user.lastDeviceId = deviceId;
  user.save(saveErr => {
    if (!callback) {
      return;
    }

    if (saveErr) {
      return callback(saveErr);
    }
    return callback(null, user);
  });
};

User.methods._updatePassword = function(password, callback) {
  const user = this;
  user.password = password;
  user.save(saveErr => {
    if (!callback) {
      return;
    }
    if (saveErr) {
      return callback(saveErr);
    }
    return callback(null, user);
  });
};

module.exports = mongoose.model("User", User);
