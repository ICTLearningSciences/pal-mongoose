/*Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))*/
const mongoose = require("mongoose");
const mongoUnit = require("mongo-unit");

mongoUnit
  .start()
  .then(url => {
    console.log("fake mongo is started with url: ", url);
    process.env.MONGO_URI = url; // this var process.env.DATABASE_URL = will keep link to fake mongo
    return mongoose.connect(url, {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useFindAndModify: false,
      useNewUrlParser: true
    });
  })
  .then(() => {
    mongoose.set("useCreateIndex", true);
    console.log("mongoose: connection successful");
    run(); // this line start mocha tests
  });

after(async () => {
  try {
    await mongoose.disconnect();
  } catch (mongooseDisconnectErr) {
    console.log(`error on mongoose disconnect: ${mongooseDisconnectErr}`);
  }
  try {
    await mongoUnit.stop();
  } catch (mongoUnitErr) {
    console.log(`error on mongo unit stop: ${mongoUnitErr}`);
  }
});
