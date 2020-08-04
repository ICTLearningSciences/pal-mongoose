/*Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))*/

const mongoose = require("./utils/mongoose");
const uuid = require("uuid");
const convertHex = require("convert-hex");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const handlePromiseOrCallback = require("./utils/handle-promise-or-callback");

const UserAccessToken = new Schema(
  {
    accessToken: { type: String, unique: true },
    resetPasswordToken: { type: String, unique: true, sparse: true },
    resetPasswordExpires: { type: Date, default: Date.now },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "{PATH} is required!",
      unique: true
    }
  },
  { timestamps: true }
);

UserAccessToken.plugin(require("./plugins/mongoose-to-id"));
UserAccessToken.plugin(require("mongoose-findorcreate"));
UserAccessToken.plugin(require("./plugins/mongoose-no-underscore-id"));
UserAccessToken.plugin(require("mongoose-cursor-pagination").default);

UserAccessToken.statics.loginWithCredentials = function(
  userNameOrEmail,
  password,
  deviceId,
  callback
) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    if (!userNameOrEmail) {
      const err = new Error("user name cannot be null or empty");
      err.status = 400;
      return reject(err);
    }
    if (!password) {
      const err = new Error("password cannot be null or empty");
      err.status = 400;
      return reject(err);
    }
    const userModel = mongoose.model("User");
    userModel
      .loginWithCredentials(userNameOrEmail, password, deviceId)
      .then(user => {
        self
          ._findOrCreateTokenForUser(user)
          .then(userToken => resolve(userToken))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
  return handlePromiseOrCallback(promise, callback);
};

UserAccessToken.statics.signUpWithCredentials = function(
  userName,
  password,
  email,
  deviceId,
  callback
) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    if (!userName) {
      const err = new Error("username cannot be null or empty");
      err.status = 400;
      return reject(err);
    }
    if (!password) {
      const err = new Error("password cannot be null or empty");
      err.status = 400;
      return reject(err);
    }
    if (!email) {
      const err = new Error("email cannot be null or empty");
      err.status = 400;
      return reject(err);
    }
    mongoose
      .model("User")
      .signUpWithCredentials(userName, password, email, deviceId)
      .then(user => {
        self
          ._findOrCreateTokenForUser(user)
          .then(userToken => resolve(userToken))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
  return handlePromiseOrCallback(promise, callback);
};

UserAccessToken.statics.authenticate = function(accessToken, callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    self.findOne({ accessToken: accessToken }, (err, token) => {
      if (err) {
        return reject(err);
      }
      if (!token) {
        err = new Error("token not found");
        err.status = 401;
        return reject(err);
      }
      const userModel = mongoose.model("User");
      userModel.findActiveById(token.user, function(userErr, user) {
        if (userErr) {
          return reject(userErr);
        }
        if (!user) {
          err = new Error(
            "cannot find associated user for token (userid=" + token.user + ")"
          );
          err.status = 401;
          return reject(err);
        }
        token.user = user;
        resolve(token);
      });
    });
  });
  return handlePromiseOrCallback(promise, callback);
};

UserAccessToken.statics.loginWithAccessToken = function(
  accessToken,
  deviceId,
  callback
) {
  this.findOne({ accessToken: accessToken }, function(err, token) {
    if (err) {
      return callback(err);
    }

    if (!token) {
      err = new Error("token not found");
      err.status = 401;
      return callback(err);
    }

    const userModel = mongoose.model("User");
    userModel.login(token.user, deviceId, (userErr, user) => {
      if (userErr) {
        return callback(userErr);
      }

      if (!user) {
        err = new Error(
          "cannot find associated user for token (userid=" + token.user + ")"
        );
        err.status = 401;
        return callback(err);
      }

      token.user = user;

      callback(null, token);
    });
  });
};

UserAccessToken.statics.forgotPassword = function(email) {
  const self = this;
  return new Promise((resolve, reject) => {
    if (!email) {
      return reject(new Error("Must pass a valid email"));
    }
    const userModel = mongoose.model("User");
    userModel.findOneActive({ email: email.toLowerCase() }).then(user => {
      if (!user) {
        const err = new Error("Email not found.");
        err.status = 401;
        return reject(err);
      }
      self
        ._findOrCreateTokenForUser(user)
        .then(userAccessToken => {
          if (!userAccessToken) {
            const err = new Error("User not found.");
            err.status = 401;
            return reject(err);
          }
          const resetToken = crypto.randomBytes(20).toString("hex");
          userAccessToken._forgotPassword(resetToken);
          userAccessToken.user = user;
          return resolve(userAccessToken);
        })
        .catch(err => reject(err));
    });
  });
};

UserAccessToken.statics.resetPassword = function(token, password) {
  const self = this;
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("must pass a valid reset token"));
    }
    if (!password) {
      return reject(new Error("must pass a valid password"));
    }
    self
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      })
      .then(userAccessToken => {
        if (!userAccessToken) {
          const err = new Error(
            "Password reset link is invalid or has expired."
          );
          err.status = 401;
          return reject(err);
        }
        mongoose
          .model("User")
          .findActiveById(userAccessToken.user)
          .then(user => {
            if (!user) {
              err = new Error(
                "cannot find associated user for token (userid=" +
                  token.user +
                  ")"
              );
              err.status = 401;
              return reject(err);
            }
            mongoose
              .model("User")
              .resetPassword(user.name, password)
              .then(user => {
                if (!user) {
                  return reject(new Error("server error"));
                }
                userAccessToken._forgotPassword(null);
                userAccessToken.user = user;
                return resolve(userAccessToken);
              })
              .catch(err => reject(err));
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

/***
 * Used internally, creates an accessToken string from a user
 *
 * @param user - User object
 * @returns an access token string
 */
UserAccessToken.statics._findOrCreateTokenForUser = function(user, callback) {
  const self = this;
  const userAccessTokenModel = this;
  const userId = this.toId(user);
  const promise = new Promise((resolve, reject) => {
    self.findOne({ user: userId }, (err, userAccessToken) => {
      if (err) {
        return reject(err);
      }
      if (userAccessToken) {
        userAccessToken.user = user; // needs to be populated
        return resolve(userAccessToken);
      }
      const userIdBytes = convertHex.hexToBytes(user._id.toHexString());
      const accessToken = uuid.v1({ node: userIdBytes.slice(6) }); // use the last 6 bytes of the user's id to generate the access token (the first 6 bytes are time and machine)
      userAccessToken = new userAccessTokenModel({
        accessToken: accessToken,
        user: userId
      });
      userAccessToken.save(saveAuthTokenErr => {
        if (saveAuthTokenErr) {
          return reject(saveAuthTokenErr);
        }
        userAccessTokenModel
          .findOne({ user: userId })
          .then(newToken => {
            if (!newToken) {
              return reject(new Error("failed to create token"));
            }
            newToken.user = user;
            return resolve(newToken);
          })
          .catch(err => reject(err));
      });
    });
  });
  return handlePromiseOrCallback(promise, callback);
};

UserAccessToken.methods._forgotPassword = function(token, callback) {
  const userAccessToken = this;
  userAccessToken.resetPasswordToken = token;
  userAccessToken.resetPasswordExpires = Date.now() + 360000;
  userAccessToken.save(saveErr => {
    if (!callback) {
      return;
    }
    if (saveErr) {
      return callback(saveErr);
    }
    return callback(null, userAccessToken);
  });
};

module.exports = mongoose.model("UserAccessToken", UserAccessToken);
