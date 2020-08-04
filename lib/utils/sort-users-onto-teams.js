/*Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))*/
const DEFAULT_COHORT_MAX_TEAMS_PER_COHORT = 6;
const DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM = 5;

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
  0, // start filling all teams of 5
  1,
  2,
  3,
  4,
  5
];

/**
 * Sort a group of users onto teams.
 */
const sortUsersOntoTeams = (teamMembers, numTeams, maxTeamSize) => {
  numTeams = !isNaN(Number(numTeams))
    ? Number(numTeams)
    : DEFAULT_COHORT_MAX_TEAMS_PER_COHORT;

  maxTeamSize = !isNaN(Number(maxTeamSize))
    ? Number(maxTeamSize)
    : DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM;

  // only include teams that exist (cohort might have fewer than 6 teams)
  const teamAssignments = teamAssignmentsTable.filter(x => x < numTeams);

  // if more teams are created, fill each team to full after main placement
  for (let i = DEFAULT_COHORT_MAX_TEAMS_PER_COHORT; i < numTeams; i++) {
    for (let n = 0; n < DEFAULT_COHORT_MAX_MEMBERS_PER_TEAM; n++) {
      teamAssignments.push(i);
    }
  }

  // remove spots that have been taken (users might join with invite code)
  teamMembers.forEach(member => {
    const idx = teamAssignments.indexOf(member.teamIndex);
    if (idx !== -1) {
      teamAssignments.splice(idx, 1);
    }
  });

  return teamMembers.map((m, i) => {
    // user is already sorted onto a team
    if (m.teamIndex !== -1) {
      return { ...m, teamIndex: m.teamIndex };
    }

    // sort user onto a team
    if (teamAssignments.length > 0) {
      return { ...m, teamIndex: teamAssignments.shift() };
    }

    // this case should not be reached
    return {
      ...m,
      teamIndex:
        (i -
          Math.floor(teamAssignmentsTable.length / maxTeamSize) +
          (teamAssignmentsTable.length % maxTeamSize)) %
        maxTeamSize
    };
  });
};

module.exports = sortUsersOntoTeams;
