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
const sortUsersOntoTeams = require("utils/sort-users-onto-teams");

const genUsers = n => {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push({ user: `u${i}`, teamIndex: -1 });
  }
  return users;
};

const expectUserTeamIndex = (users, ix, expectTeamIx) => {
  expect(
    users[ix].teamIndex,
    `user ${ix + 1} should be on team ${expectTeamIx + 1}`
  ).to.equal(expectTeamIx);
};

const teamAssignmentsTable = [
  0, // start teams of 2
  0,
  1,
  1,
  2,
  2,
  0, // start teams of 3
  1,
  2,
  0, // start teams of 4
  1,
  2,
  3, // start filling new teams of 2
  3,
  4,
  4,
  5,
  5,
  3, // start filling teams of 3
  4,
  5,
  3, // start filling teams of 4
  4,
  5,
  0, // start filling teams of 5
  1,
  2,
  3,
  4,
  5
];

const expectUserTeamAssigments = n => {
  it(`assigns user ${n} to team ${teamAssignmentsTable[n - 1] +
    1}`, function() {
    const usersBefore = genUsers(n);
    const usersAfter = sortUsersOntoTeams(usersBefore);
    for (let i = 0; i < n; i++) {
      expectUserTeamIndex(usersAfter, i, teamAssignmentsTable[i]);
    }
  });
};

describe("sort-users-onto-teams", () => {
  for (let i = 1; i < teamAssignmentsTable.length + 1; i++) {
    expectUserTeamAssigments(i);
  }
});

describe("sort users onto cohort", () => {
  it("with 1 team", () => {
    const usersBefore = genUsers(5);
    const usersAfter = sortUsersOntoTeams(usersBefore, 1);

    for (let i = 0; i < 5; i++) {
      expectUserTeamIndex(usersAfter, i, 0);
    }
  });

  it("with 2 teams", () => {
    const usersBefore = genUsers(10);
    const usersAfter = sortUsersOntoTeams(usersBefore, 2);

    expectUserTeamIndex(usersAfter, 0, 0);
    expectUserTeamIndex(usersAfter, 1, 0);
    expectUserTeamIndex(usersAfter, 2, 1);
    expectUserTeamIndex(usersAfter, 3, 1);
    expectUserTeamIndex(usersAfter, 4, 0);
    expectUserTeamIndex(usersAfter, 5, 1);
    expectUserTeamIndex(usersAfter, 6, 0);
    expectUserTeamIndex(usersAfter, 7, 1);
    expectUserTeamIndex(usersAfter, 8, 0);
    expectUserTeamIndex(usersAfter, 9, 1);
  });

  it("with more than default (6) number of teams", () => {
    const usersBefore = genUsers(40);
    const usersAfter = sortUsersOntoTeams(usersBefore, 8);

    for (let i = 0; i < teamAssignmentsTable.length; i++) {
      expectUserTeamIndex(usersAfter, i, teamAssignmentsTable[i]);
    }
    for (let i = 30; i < 35; i++) {
      expectUserTeamIndex(usersAfter, i, 6);
    }
    for (let i = 35; i < 40; i++) {
      expectUserTeamIndex(usersAfter, i, 7);
    }
  });
});
