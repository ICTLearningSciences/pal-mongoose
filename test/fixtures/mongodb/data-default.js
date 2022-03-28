/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
module.exports = {
  careers: [
    {
      _id: ObjectId("5d799472becb4e208db91c7a"),
      alias: "e2-fire-controlman",
      createdAt: "2019-09-12T00:42:26.429Z",
      desc: "",
      name: "E2 Fire Controlman",
      ord: 1,
      suggestedGoals: [
        ObjectId("5b5a2cd69b1fafcf999d957e"),
        ObjectId("5bb6540cbecb4e208da0fb65"),
        ObjectId("5bb6540cbecb4e208da0fb64")
      ],
      updatedAt: "2020-01-15T20:17:48.765Z",
      defaultSuggested: true
    },
    {
      _id: ObjectId("5d799472becb4e208db91c7b"),
      alias: "e6-petty-officer-first-class",
      createdAt: "2019-09-12T00:42:26.429Z",
      desc: "",
      name: "E6 Petty Officer First Class",
      ord: 3,
      suggestedGoals: [ObjectId("5d643ec1becb4e208d4bcf81")],
      updatedAt: "2020-01-15T20:17:48.765Z"
    },
    {
      _id: ObjectId("5d799472becb4e208db91c7c"),
      alias: "e5-petty-officer-second-class",
      createdAt: "2019-09-12T00:42:26.429Z",
      desc: "",
      name: "E5 Petty Officer Second Class",
      ord: 2,
      suggestedGoals: [ObjectId("5d643ec1becb4e208d4bcf81")],
      updatedAt: "2020-01-15T20:17:48.765Z"
    },
    {
      _id: ObjectId("5d799472becb4e208db91c7d"),
      alias: "dhs-testing-and-evaluation-leader",
      createdAt: "2019-09-12T00:42:26.429Z",
      desc: "",
      name: "DHS Testing & Evaluation Leader",
      ord: 0,
      suggestedGoals: [ObjectId("5d701ba9becb4e208d893545")],
      updatedAt: "2020-01-15T20:17:48.765Z"
    }
  ],

  cohorts: [
    {
      _id: ObjectId("5ed86dbe14f1e930dcd03ec9"),
      name: "Test Cohort",
      nameCanonical: "testcohort"
    },
    {
      _id: ObjectId("5edaa35f7b3a751d291f9932"),
      name: " Unjoinable ",
      nameCanonical: "unjoinable"
    },
    {
      _id: ObjectId("5ed82fb2a869c32825c74474"),
      name: "Study Cohort",
      nameCanonical: "studycohort"
    }
  ],

  goals: [
    {
      _id: ObjectId("5b5a2cd69b1fafcf999d957e"),
      alias: "advancement-test-fc-e3",
      createdAt: new Date("2018-10-04T17:55:24.839Z"),
      desc:
        "Advancement tests are particularly important reaching E3 and E4 ratings. Study electronics skills, leadership, and general navy information to ace your test.",
      firstTimeSurveyId: "survey1",
      focusList: [
        {
          topics: [
            ObjectId("5bb6540bbecb4e208da0f6e7"),
            ObjectId("5bb6540bbecb4e208da0f6f9"),
            ObjectId("5bb6540bbecb4e208da0f6eb"),
            ObjectId("5bb6540bbecb4e208da0f6e9"),
            ObjectId("5bb6540bbecb4e208da0f6f5"),
            ObjectId("5bb6540bbecb4e208da0f6f8")
          ],
          name: "Technical Skills",
          desc:
            "Fundamental and applied electronics, such as understanding components and diagnosing faults.",
          _id: "technical-skills"
        },
        {
          topics: [
            ObjectId("5bb6540bbecb4e208da0f6f0"),
            ObjectId("5bb6540bbecb4e208da0f6e1"),
            ObjectId("5cffef5dbecb4e208d44ea65")
          ],
          name: "Navy Life",
          desc:
            "Navy culture and requirements, such as ship types, rates, symbols, and acronyms.",
          _id: "navy-life"
        },
        {
          topics: [
            ObjectId("5bb6540bbecb4e208da0f6ee"),
            ObjectId("5bb6540bbecb4e208da0f6e3")
          ],
          name: "Leadership",
          desc:
            "Skills required for petty officers, such as dealing with performance problems or conflict in a team.",
          _id: "leadership"
        }
      ],
      name: "Advancement Test - FC E3",
      updatedAt: new Date("2020-04-29T21:08:07.453Z")
    },

    {
      _id: ObjectId("5bb6540cbecb4e208da0fb64"),
      alias: "health-and-wellness",
      __v: 0,
      createdAt: new Date("2018-10-04T17:55:24.839Z"),
      desc:
        "Improve your academic and job performance through skills sleep management, exercise skills, and eating habits.",
      focusList: [
        {
          topics: [ObjectId("5bb6540bbecb4e208da0f6f7")],
          name: "Sleep Disturbances",
          desc: "Skills and tips about how to sleep better.",
          _id: "sleep-disturbances"
        }
      ],
      name: "Health and Wellness",
      updatedAt: new Date("2020-04-29T21:08:07.453Z")
    },

    {
      _id: ObjectId("5bb6540cbecb4e208da0fb65"),
      alias: "college-preparation",
      __v: 0,
      createdAt: new Date("2018-10-04T17:55:24.839Z"),
      desc:
        "Study Math, English, and writing skills required for admission and success in a competitive degree program. Review pros and cons for colleges and university options.",
      focusList: [
        {
          topics: [ObjectId("5bb6540bbecb4e208da0f6ec")],
          name: "Algebra 1",
          desc: "Symbolic math, such as single variable equations.",
          _id: "algebra-1"
        }
      ],
      name: "College Preparation",
      updatedAt: new Date("2020-04-29T21:08:07.453Z")
    },

    {
      _id: ObjectId("5d643ec1becb4e208d4bcf81"),
      alias: "transition-to-leadership",
      __v: 0,
      createdAt: new Date("2019-08-26T20:18:54.465Z"),
      desc:
        "Learn the baseline for what is expected as a leader, how to solve common personnel problems, and learn strategies to approach more complex problems.",
      focusList: [
        {
          topics: [
            ObjectId("5bb6540bbecb4e208da0f6e3"),
            ObjectId("5d643ebebecb4e208d4bcc4a"),
            ObjectId("5d643ebebecb4e208d4bcc42"),
            ObjectId("5cffef5dbecb4e208d44ea65")
          ],
          name: "Transition to Leadership",
          desc:
            "Learn the baseline for what is expected as a leader, how to solve common personnel problems, and learn strategies to approach more complex problems.",
          _id: "transition-to-leadership"
        }
      ],
      name: "Transition to Leadership",
      updatedAt: new Date("2020-04-29T21:08:07.453Z")
    },

    {
      _id: ObjectId("5d701ba9becb4e208d893545"),
      alias: "testing-and-evaluation-training",
      __v: 0,
      createdAt: new Date("2019-09-04T20:16:41.916Z"),
      desc: "",
      focusList: [
        {
          topics: [ObjectId("5d701ba9becb4e208d8931f8")],
          name: "Testing & Evaluation Training",
          desc: "",
          _id: "testing-and-evaluation-training"
        }
      ],
      name: "Testing & Evaluation Training",
      updatedAt: new Date("2020-04-29T21:08:07.453Z")
    },

    {
      _id: ObjectId("5bb6540cdecb4e208da0fb64"),
      name: "Test",
      alias: "test",
      desc: "Test",
      focusList: [
        {
          name: "Test",
          desc: "Test",
          _id: "test",
          topics: ["sleep-habits-101"]
        }
      ]
    }
  ],

  knowledgecomponents: [
    {
      _id: ObjectId("5bb6540abecb4e208da0f5cf"),
      alias: "bridge-rectifier-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "bridge-rectifier-behavior",
      name: "bridge-rectifier-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5d6"),
      alias: "basic-capacitor-filter-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "basic-capacitor-filter-behavior",
      name: "basic-capacitor-filter-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5d7"),
      alias: "autotutor-interactions",

      createdAt: "2018-10-04T17:55:19.364Z",
      desc: "autotutor-interactions",
      name: "autotutor-interactions",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5d8"),
      alias: "alternating-current-behavior",

      createdAt: "2018-10-04T17:55:19.363Z",
      desc: "alternating-current-behavior",
      name: "alternating-current-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5df"),
      alias: "bridge-rectifier-with-capacitor-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "bridge-rectifier-with-capacitor-behavior",
      name: "bridge-rectifier-with-capacitor-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5e4"),
      alias: "capacitor-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "capacitor-behavior",
      name: "capacitor-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5e5"),
      alias: "ce-transistor-fixed-bias-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "ce-transistor-fixed-bias-behavior",
      name: "ce-transistor-fixed-bias-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5ea"),
      alias: "ce-transistor-function",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "ce-transistor-function",
      name: "ce-transistor-function",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5ed"),
      alias: "ce-transistor-physics",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "ce-transistor-physics",
      name: "ce-transistor-physics",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5f0"),
      alias: "diode-behavior-avalanche",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "diode-behavior-avalanche",
      name: "diode-behavior-avalanche",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5f5"),
      alias: "diode-physics",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "diode-physics",
      name: "diode-physics",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5f8"),
      alias: "diode-behavior-reverse",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "diode-behavior-reverse",
      name: "diode-behavior-reverse",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5f9"),
      alias: "electro-optical-sensor-system-function",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "electro-optical-sensor-system-function",
      name: "electro-optical-sensor-system-function",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5fa"),
      alias: "full-wave-rectifier-behavior",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "full-wave-rectifier-behavior",
      name: "full-wave-rectifier-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f5fe"),
      alias: "fc-e-3-rank-achieved",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "fc-e-3-rank-achieved",
      name: "fc-e-3-rank-achieved",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f602"),
      alias: "generic",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc:
        "When a resource isn't associated with any knowledge component, this is used",
      name: "Generic",
      updatedAt: "2019-02-05T21:35:29.743Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f603"),
      alias: "full-wave-voltage-doubler-behavior",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "",
      name: "Full Wave Voltage Doubler Behavior",
      updatedAt: "2019-02-05T21:35:29.743Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f60a"),
      alias: "inductor-behavior",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "inductor-behavior",
      name: "inductor-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f60d"),
      alias: "half-wave-rectifier-behavior",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "half-wave-rectifier-behavior",
      name: "half-wave-rectifier-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f60e"),
      alias: "generator-behavior",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "generator-behavior",
      name: "generator-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f611"),
      alias: "inots-lisa",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "inots-lisa",
      name: "inots-lisa",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f613"),
      alias: "inots-check",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "inots-check",
      name: "inots-check",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f617"),
      alias: "lc-choke-input-filter-behavior",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "lc-choke-input-filter-behavior",
      name: "lc-choke-input-filter-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f61c"),
      alias: "incandescent-bulb-behavior",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "incandescent-bulb-behavior",
      name: "incandescent-bulb-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f61f"),
      alias: "invalid-kc-entry",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "Placeholder for unknown KC values.",
      name: "Invalid KC Entry",
      updatedAt: "2019-02-05T21:35:29.744Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f622"),
      alias: "negative-biased-positive-clamper-behavior",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "",
      name: "Negative Biased Positive Clamper Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f627"),
      alias: "ce-transistor-battery-bias-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "ce-transistor-battery-bias-behavior",
      name: "ce-transistor-battery-bias-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f62a"),
      alias: "inots-initiate",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "inots-initiate",
      name: "inots-initiate",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f62b"),
      alias: "navy-general-information",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "navy-general-information",
      name: "navy-general-information",
      updatedAt: "2020-04-29T21:08:04.915Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f62e"),
      alias: "parallel-negative-limiter-with-negative-bias-behavior",

      createdAt: "2018-10-04T17:55:19.370Z",
      desc: "",
      name: "Parallel Negative Limiter with Negative Bias Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f633"),
      alias: "diode-behavior-forward",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "diode-behavior-forward",
      name: "diode-behavior-forward",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f636"),
      alias: "kirchoffs-voltage-law",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "kirchoffs-voltage-law",
      name: "kirchoffs-voltage-law",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f637"),
      alias: "negative-half-wave-rectifier-behavior",

      createdAt: "2018-10-04T17:55:19.370Z",
      desc: "negative-half-wave-rectifier-behavior",
      name: "negative-half-wave-rectifier-behavior",
      updatedAt: "2020-04-29T21:08:04.915Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f63a"),
      alias: "parallel-positive-limiter-with-positive-bias-behavior",

      createdAt: "2018-10-04T17:55:19.370Z",
      desc: "",
      name: "Parallel Positive Limiter with Positive Bias Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f63b"),
      alias: "fc-a-school-integration",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "fc-a-school-integration",
      name: "fc-a-school-integration",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f63c"),
      alias: "parallel-positive-limiter-behavior",

      createdAt: "2018-10-04T17:55:19.370Z",
      desc: "",
      name: "Parallel Positive Limiter Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f63f"),
      alias: "ce-transistor-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "ce-transistor-behavior",
      name: "ce-transistor-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f642"),
      alias: "ce-transistor-voltage-divider-bias-behavior",

      createdAt: "2018-10-04T17:55:19.365Z",
      desc: "ce-transistor-voltage-divider-bias-behavior",
      name: "ce-transistor-voltage-divider-bias-behavior",
      updatedAt: "2020-04-29T21:08:04.913Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f645"),
      alias: "general-leadership",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "general-leadership",
      name: "general-leadership",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f648"),
      alias: "dragoon-interactions",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "dragoon-interactions",
      name: "dragoon-interactions",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f64b"),
      alias: "half-wave-voltage-doubler-behavior",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "half-wave-voltage-doubler-behavior",
      name: "half-wave-voltage-doubler-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f64e"),
      alias: "full-wave-rectifier-with-zener-behavior",

      createdAt: "2018-10-04T17:55:19.366Z",
      desc: "full-wave-rectifier-with-zener-behavior",
      name: "full-wave-rectifier-with-zener-behavior",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f651"),
      alias: "inots-evaluate",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "inots-evaluate",
      name: "inots-evaluate",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f654"),
      alias: "good-sleep-habits",

      createdAt: "2018-10-04T17:55:19.367Z",
      desc: "good-sleep-habits",
      name: "good-sleep-habits",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f657"),
      alias: "kirchoffs-current-law",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "kirchoffs-current-law",
      name: "kirchoffs-current-law",
      updatedAt: "2020-04-29T21:08:04.914Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f65a"),
      alias: "navy-ranks",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "navy-ranks",
      name: "navy-ranks",
      updatedAt: "2020-04-29T21:08:04.915Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f65d"),
      alias: "ohms-law-voltage",

      createdAt: "2018-10-04T17:55:19.370Z",
      desc: "ohms-law-voltage",
      name: "ohms-law-voltage",
      updatedAt: "2020-04-29T21:08:04.915Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f660"),
      alias: "negative-biased-negative-clamper-behavior",

      createdAt: "2018-10-04T17:55:19.368Z",
      desc: "",
      name: "Negative Biased Negative Clamper Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f665"),
      alias: "parallel-negative-limiter-behavior",

      createdAt: "2018-10-04T17:55:19.370Z",
      desc: "",
      name: "Parallel Negative Limiter Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    },

    {
      _id: ObjectId("5bb6540abecb4e208da0f668"),
      alias: "positive-biased-negative-clamper-behavior",

      createdAt: "2018-10-04T17:55:19.371Z",
      desc: "",
      name: "Positive Biased Negative Clamper Behavior",
      updatedAt: "2019-02-05T21:35:29.745Z"
    }
  ],

  topics: [
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6dd"),
      alias: "c-school-entrance-capstone",
      createdAt: "2018-10-04T17:55:22.948Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807b57fc94089"),
          kc: ObjectId("5bb6540abecb4e208da0f63b")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448077906c9408a"),
          kc: ObjectId("5bb6540abecb4e208da0f5f9")
        }
      ],
      attributeRelevance: [
        {
          name: "variable1",
          value: 0.5
        }
      ],
      name: "C-School Entrance Capstone",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [
        ObjectId("5bb6540bbecb4e208da0f6f5"),
        ObjectId("5bb6540bbecb4e208da0f6f8")
      ]
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6e1"),
      alias: "navy-general-information",
      createdAt: "2018-10-04T17:55:22.949Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448076273c940ac"),
          kc: ObjectId("5bb6540abecb4e208da0f62b")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480763acc940ad"),
          kc: ObjectId("5bb6540abecb4e208da0f68c")
        }
      ],
      name: "Navy General Information",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5bb6540bbecb4e208da0f6f4")]
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6e7"),
      alias: "diode-action",
      __v: 0,
      createdAt: "2018-10-04T17:55:22.949Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807eefdc9408b"),
          kc: ObjectId("5bb6540abecb4e208da0f633")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071855c9408c"),
          kc: ObjectId("5bb6540abecb4e208da0f5f8")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807a7d2c9408d"),
          kc: ObjectId("5bb6540abecb4e208da0f5f5")
        }
      ],
      name: "Diode Action",
      prerequisiteTopics: [],
      updatedAt: "2020-04-29T21:08:05.630Z"
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6e9"),
      alias: "half-and-full-wave-rectifiers",
      createdAt: "2018-10-04T17:55:22.949Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480789c4c94093"),
          kc: ObjectId("5bb6540abecb4e208da0f60d")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071569c94094"),
          kc: ObjectId("5bb6540abecb4e208da0f637")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807322fc94095"),
          kc: ObjectId("5bb6540abecb4e208da0f673")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071cbcc94096"),
          kc: ObjectId("5bb6540abecb4e208da0f6a6")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807cd4cc94097"),
          kc: ObjectId("5bb6540abecb4e208da0f689")
        }
      ],
      name: "Half and Full-Wave Rectifiers",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5bb6540bbecb4e208da0f6eb")]
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6eb"),
      alias: "rlc-circuits-and-filters",
      createdAt: "2018-10-04T17:55:22.950Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807265fc940b4"),
          kc: ObjectId("5bb6540abecb4e208da0f6bc")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448076865c940b5"),
          kc: ObjectId("5bb6540abecb4e208da0f66e")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807c561c940b6"),
          kc: ObjectId("5bb6540abecb4e208da0f5e4")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448072083c940b7"),
          kc: ObjectId("5bb6540abecb4e208da0f60a")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480767fac940b8"),
          kc: ObjectId("5bb6540abecb4e208da0f677")
        }
      ],
      name: "RLC Circuits and Filters",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: []
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6ec"),
      alias: "polynomials-intro",
      createdAt: "2018-10-04T17:55:22.950Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071324c940af"),
          kc: ObjectId("5bb6540abecb4e208da0f6c5")
        }
      ],
      name: "Polynomials Intro",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: []
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6ee"),
      alias: "leadership",
      __v: 0,
      createdAt: "2018-10-04T17:55:22.949Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448078ee2c940a7"),
          kc: ObjectId("5bb6540abecb4e208da0f645")
        }
      ],
      name: "Leadership",
      prerequisiteTopics: [],
      updatedAt: "2020-04-29T21:08:05.630Z"
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f0"),
      alias: "navy-ranks",
      __v: 0,
      createdAt: "2018-10-04T17:55:22.950Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480746a6c940ae"),
          kc: ObjectId("5bb6540abecb4e208da0f65a")
        }
      ],
      name: "Navy Rates",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: []
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f2"),
      alias: "no-topic",
      createdAt: "2018-10-04T17:55:22.950Z",
      knowledgeComponents: [],
      name: "No Topic - Warehouse for Lessons that have no topic (fix us!)",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: []
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f4"),
      alias: "tutorials-for-pal3",
      __v: 0,
      createdAt: "2018-10-04T17:55:22.951Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448075bc8c940bc"),
          kc: ObjectId("5bb6540abecb4e208da0f5d7")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071b0dc940bd"),
          kc: ObjectId("5bb6540abecb4e208da0f648")
        }
      ],
      name: "Tutorials for PAL3",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: []
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f5"),
      alias: "regulators-and-smoothing",
      createdAt: "2018-10-04T17:55:22.950Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448072205c940b0"),
          kc: ObjectId("5bb6540abecb4e208da0f5fa")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807658dc940b1"),
          kc: ObjectId("5bb6540abecb4e208da0f689")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807151bc940b2"),
          kc: ObjectId("5bb6540abecb4e208da0f5e4")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448075609c940b3"),
          kc: ObjectId("5bb6540abecb4e208da0f66e")
        }
      ],
      name: "Regulators and Smoothing",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [
        ObjectId("5bb6540bbecb4e208da0f6e9"),
        ObjectId("5bb6540bbecb4e208da0f6f9")
      ]
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f8"),
      alias: "transistor-biasing",
      createdAt: "2018-10-04T17:55:22.951Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807753cc940ba"),
          kc: ObjectId("5bb6540abecb4e208da0f63f")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807dfeac940bb"),
          kc: ObjectId("5bb6540abecb4e208da0f5ea")
        }
      ],
      name: "Transistor Biasing",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5bb6540bbecb4e208da0f6e9")]
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f9"),
      alias: "zener-diode-action",
      createdAt: "2018-10-04T17:55:22.951Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448074823c940be"),
          kc: ObjectId("5bb6540abecb4e208da0f68e")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480742f3c940bf"),
          kc: ObjectId("5bb6540abecb4e208da0f693")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448077e59c940c0"),
          kc: ObjectId("5bb6540abecb4e208da0f690")
        }
      ],
      name: "Zener Diode Action",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5bb6540bbecb4e208da0f6e7")]
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6e5"),
      alias: "fc-e-3-milestone",
      __v: 0,
      createdAt: "2018-10-04T17:55:22.949Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807e85dc9408e"),
          kc: ObjectId("5bb6540abecb4e208da0f5fe")
        }
      ],
      name: "FC E-3 Milestone",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5bb6540bbecb4e208da0f6dd")]
    },
    {
      _id: ObjectId("5c104a18becb4e208d992ff4"),
      alias: "taf",
      createdAt: "2018-12-11T23:36:23.852Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5c17f368ea9e9d78646ec4e4"),
          kc: ObjectId("5bb6540abecb4e208da0f633")
        },
        {
          relevance: 1,
          _id: ObjectId("5c17f368ea9e9d78646ec4e3"),
          kc: ObjectId("5bb6540abecb4e208da0f5f8")
        },
        {
          relevance: 1,
          _id: ObjectId("5c17f368ea9e9d78646ec4e2"),
          kc: ObjectId("5bb6540abecb4e208da0f5f5")
        }
      ],
      name: "Test Modernization",
      updatedAt: "2018-12-17T19:05:12.809Z"
    },
    {
      _id: ObjectId("5d643ebebecb4e208d4bcc4a"),
      alias: "leadership-strategies-101",
      createdAt: "2019-08-26T20:18:51.797Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807d6cec940a8"),
          kc: ObjectId("5e41c02bf9621cf55a11060d")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448070f74c940a9"),
          kc: ObjectId("5e41c02bf9621cf55a11060a")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480725a1c940aa"),
          kc: ObjectId("5e41c02bf9621cf55a110610")
        }
      ],
      name: "Leadership Strategies 101",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5bb6540bbecb4e208da0f6e3")],
      pronunciation: "Leadership Strategies One Oh One"
    },
    {
      _id: ObjectId("5c1d2653becb4e208dc30196"),
      alias: "integrated-electronics",
      createdAt: "2018-12-21T17:42:50.319Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807d584c940a4"),
          kc: ObjectId("5bb6540abecb4e208da0f633")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807466dc940a5"),
          kc: ObjectId("5bb6540abecb4e208da0f5f8")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807a89ec940a6"),
          kc: ObjectId("5bb6540abecb4e208da0f5f5")
        }
      ],
      name: "Integrated Electronics",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [
        ObjectId("5bb6540bbecb4e208da0f6f5"),
        ObjectId("5bb6540bbecb4e208da0f6f8")
      ]
    },
    {
      _id: ObjectId("5cffef5dbecb4e208d44ea65"),
      alias: "full-speed-ahead",
      __v: 0,
      createdAt: "2019-06-11T18:13:49.410Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448078339c9408f"),
          kc: ObjectId("5cffef5dbecb4e208d44e9f3")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480754b1c94090"),
          kc: ObjectId("5cffef5dbecb4e208d44e9e5")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480702ffc94091"),
          kc: ObjectId("5cffef5dbecb4e208d44e9e2")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807dd1cc94092"),
          kc: ObjectId("5cffef5dbecb4e208d44e9ee")
        }
      ],
      name: "Full Speed Ahead",
      recommender: "linear",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: []
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6e3"),
      alias: "inots",
      createdAt: "2018-10-04T17:55:22.949Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448075b34c94098"),
          kc: ObjectId("5bb6540abecb4e208da0f611")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480784fbc94099"),
          kc: ObjectId("5bb6540abecb4e208da0f62a")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807006ec9409a"),
          kc: ObjectId("5bb6540abecb4e208da0f613")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807ecf6c9409b"),
          kc: ObjectId("5bb6540abecb4e208da0f6b6")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807944dc9409c"),
          kc: ObjectId("5bb6540abecb4e208da0f6b9")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071755c9409d"),
          kc: ObjectId("5bb6540abecb4e208da0f651")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807358fc9409e"),
          kc: ObjectId("5cffef5dbecb4e208d44ea1e")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480711c2c9409f"),
          kc: ObjectId("5cffef5dbecb4e208d44ea0d")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448072916c940a0"),
          kc: ObjectId("5cffef5dbecb4e208d44ea0a")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448075d5cc940a1"),
          kc: ObjectId("5cffef5dbecb4e208d44ea10")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448071882c940a2"),
          kc: ObjectId("5cffef5dbecb4e208d44ea31")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448070ebac940a3"),
          kc: ObjectId("5cffef5dbecb4e208d44ea0e")
        }
      ],
      name: "INOTS",
      prerequisiteTopics: [],
      updatedAt: "2020-04-29T21:08:05.630Z",
      recommender: "linear",
      pronunciation: "Eye Knots"
    },
    {
      _id: ObjectId("5d643ebebecb4e208d4bcc42"),
      alias: "life-family-adjustment",
      createdAt: "2019-08-26T20:18:51.797Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807799ac940ab"),
          kc: ObjectId("5d643ebebecb4e208d4bcc08")
        }
      ],
      name: "Life Family Adjustment",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [ObjectId("5d643ebebecb4e208d4bcc4a")]
    },
    {
      _id: ObjectId("5d701ba9becb4e208d8931f8"),
      alias: "agile-software-development-i",
      createdAt: "2019-09-04T20:16:41.026Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb554480781e2c94087"),
          kc: ObjectId("5d8e66dfbecb4e208d16bfd3")
        },
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb55448076a6fc94088"),
          kc: ObjectId("5d8e66dfbecb4e208d16bfdc")
        }
      ],
      name: "Agile Software Development I",
      prerequisiteTopics: [],
      updatedAt: "2020-04-29T21:08:05.630Z",
      recommender: "linear",
      pronunciation: "Agile Software Development One"
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f6f7"),
      alias: "sleep-habits-101",
      createdAt: "2018-10-04T17:55:22.950Z",
      knowledgeComponents: [
        {
          relevance: 1,
          _id: ObjectId("5ea9ecb5544807bdbec940b9"),
          kc: ObjectId("5bb6540abecb4e208da0f654")
        }
      ],
      name: "Sleep Habits 101",
      updatedAt: "2020-04-29T21:08:05.630Z",
      prerequisiteTopics: [],
      pronunciation: "Sleep Habits One Oh One"
    }
  ],

  lessons: [
    {
      _id: ObjectId("5bb6540cbecb4e208da0f9c5"),
      alias: "diode-action-prerequisites",
      desc: "Revisit basic circuits and diodes.",
      displayType: "multiple-choice",
      name: "Prerequisites",
      ord: 0,
      resources: [
        ObjectId("5bb6540bbecb4e208da0f721"),
        ObjectId("5bb6540bbecb4e208da0f71e"),
        ObjectId("5bb6540bbecb4e208da0f723"),
        ObjectId("5bb6540bbecb4e208da0f725")
      ],
      topic: ObjectId("5bb6540bbecb4e208da0f6e7"),
      type: "testing",
      downloadable: true,
      deleted: false
    },
    {
      _id: ObjectId("5bb6540cbecb4e208da0f9b4"),
      alias: "diode-action-diodes-tutorial",
      createdAt: "2018-10-04T17:55:24.263Z",
      desc: "An intro tutorial covering the basics of diodes.",
      displayType: "web",
      name: "Diodes (Tutorial)",
      ord: 1,
      resources: [ObjectId("5bb6540bbecb4e208da0f72c")],
      topic: ObjectId("5bb6540bbecb4e208da0f6e7"),
      type: "teaching",
      updatedAt: "2020-01-15T20:17:48.048Z",
      deleted: false
    },
    {
      _id: ObjectId("5bb6540cbecb4e208da0f9b5"),
      alias: "diode-action-transistors-sneak-peak",
      createdAt: "2018-10-04T17:55:24.264Z",
      desc: "Revisit basic circuits.",
      displayType: "web",
      estMinHigh: 3,
      estMinLow: 2,
      name: "Transistors: Sneak Peek",
      ord: -1,
      resources: [ObjectId("5bb6540bbecb4e208da0f729")],
      topic: ObjectId("5bb6540bbecb4e208da0f6e7"),
      type: "testing",
      updatedAt: "2020-01-15T20:17:48.383Z",
      deleted: true
    },
    {
      _id: ObjectId("5bb6540cbecb4e208da0f9b6"),
      alias: "diode-action-review-diode-current-flow",
      createdAt: "2018-10-04T17:55:24.264Z",
      desc: "The direction that current flows in a diode",
      displayType: "auto-tutor",
      downloadable: true,
      name: "Review Diode Current Flow",
      ord: 2,
      resources: [ObjectId("5bb6540bbecb4e208da0f727")],
      topic: ObjectId("5bb6540bbecb4e208da0f6e7"),
      type: "testing",
      updatedAt: "2020-01-15T20:17:48.048Z",
      deleted: false
    },
    {
      _id: ObjectId("5bb6540cbecb4e208da0f9b8"),
      alias: "diode-action-review-normal-diode-breakdown-mode",
      createdAt: "2018-10-04T17:55:24.264Z",
      desc: "Describe how reverse bias current flow affects a normal diode",
      displayType: "auto-tutor",
      downloadable: true,
      name: "Review Normal Diode Breakdown Mode",
      ord: 3,
      resources: [ObjectId("5bb6540bbecb4e208da0f72f")],
      topic: ObjectId("5bb6540bbecb4e208da0f6e7"),
      type: "testing",
      updatedAt: "2020-01-15T20:17:48.048Z",
      deleted: false
    },

    {
      _id: ObjectId("5bb6540cbecb4e208da0fa6d"),
      name: "Polynomials Overview",
      alias: "polynomials-intro-polynomials-overview",
      desc: "",
      type: "testing",
      displayType: "web",
      ord: 0,
      estMinLow: 1,
      estMinHigh: 2,
      downloadable: null,
      deleted: false,
      topic: ObjectId("5bb6540bbecb4e208da0f6ec")
    }
  ],

  resources: [
    {
      _id: ObjectId("5cffef5ebecb4e208d44eb41"),
      explorationLevel: 0.5,
      duration: 10,
      alias: "inots-pushing-the-line",
      createdAt: "2019-06-11T18:13:49.628Z",
      isCmiAU: true,
      knowledgeComponents: [
        { relevance: 1, kc: "5cffef5dbecb4e208d44ea1e" },
        { relevance: 1, kc: "5cffef5dbecb4e208d44ea0d" },
        { relevance: 1, kc: "5cffef5dbecb4e208d44ea0a" },
        { relevance: 1, kc: "5cffef5dbecb4e208d44ea10" },
        { relevance: 1, kc: "5cffef5dbecb4e208d44ea31" },
        { relevance: 1, kc: "5cffef5dbecb4e208d44ea0e" }
      ],
      type: "web-active",
      updatedAt: "2019-11-27T18:40:48.771Z",
      uri: "https://dev.inots.org/8/?noheader=true",
      assets: [],
      _id: ObjectId("5cffef5ebecb4e208d44eb41")
    },
    {
      _id: ObjectId("5b5a2cd69b1fafcf999d9222"),
      explorationLevel: 0,
      duration: 60,
      alias: "Polynomials Overview",
      knowledgeComponents: [{ relevance: 1, kc: "polynomials" }],
      type: "web-passive",
      uri:
        "https://www.khanacademy.org/math/algebra/introduction-to-polynomial-expressions/introduction-to-polynomials/v/polynomials-intro",
      assets: []
    },

    {
      _id: ObjectId("5bb6540bbecb4e208da0f71e"),
      alias: "diodes-101-mcq-prerequisites-02",
      duration: 60,
      explorationLevel: 0.25,
      knowledgeComponents: [
        {
          relevance: 1,
          kc: ObjectId("5bb6540abecb4e208da0f636")
        }
      ],
      type: "multiple-choice",
      uri: "diodes-101-mcq-prerequisites-02",
      assets: [
        {
          name: "data",
          type: "json",
          uri:
            "/api/1.0/resource-content/multiple-choice-questions/diodes-101-mcq-prerequisites-02"
        },
        {
          name: "image-main",
          type: "image",
          uri:
            "/resources/diode-action/prerequisites/mcq-02/assets/main-image.png"
        }
      ],
      contentType: "multiple-choice"
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f721"),
      alias: "diodes-101-mcq-prerequisites-01",
      duration: 60,
      explorationLevel: 0.25,
      knowledgeComponents: [
        {
          relevance: 1,
          kc: ObjectId("5bb6540abecb4e208da0f633")
        }
      ],
      type: "multiple-choice",
      uri: "diodes-101-mcq-prerequisites-01",
      assets: [
        {
          name: "data",
          type: "json",
          uri:
            "/api/1.0/resource-content/multiple-choice-questions/diodes-101-mcq-prerequisites-01"
        },
        {
          name: "image-main",
          type: "image",
          uri:
            "/resources/diode-action/prerequisites/mcq-01/assets/main-image.png"
        }
      ],
      contentType: "multiple-choice"
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f723"),
      alias: "diodes-101-mcq-prerequisites-03",
      duration: 60,
      explorationLevel: 0.25,
      knowledgeComponents: [
        {
          relevance: 1,
          kc: ObjectId("5bb6540abecb4e208da0f5f8")
        }
      ],
      type: "multiple-choice",
      uri: "diodes-101-mcq-prerequisites-03",
      assets: [
        {
          name: "data",
          type: "json",
          uri:
            "/api/1.0/resource-content/multiple-choice-questions/diodes-101-mcq-prerequisites-03"
        },
        {
          name: "image-main",
          type: "image",
          uri:
            "/resources/diode-action/prerequisites/mcq-03/assets/main-image.png"
        }
      ],
      contentType: "multiple-choice"
    },
    {
      _id: ObjectId("5bb6540bbecb4e208da0f725"),
      alias: "diodes-101-mcq-prerequisites-04",
      duration: 60,
      explorationLevel: 0.25,
      knowledgeComponents: [
        {
          relevance: 1,
          kc: ObjectId("5bb6540abecb4e208da0f5f8")
        }
      ],
      type: "multiple-choice",
      uri: "diodes-101-mcq-prerequisites-04",
      assets: [
        {
          name: "data",
          type: "json",
          uri:
            "/api/1.0/resource-content/multiple-choice-questions/diodes-101-mcq-prerequisites-04"
        },
        {
          name: "image-main",
          type: "image",
          uri:
            "/resources/diode-action/prerequisites/mcq-04/assets/main-image.png"
        }
      ],
      contentType: "multiple-choice"
    }
  ],

  plans: [
    {
      _id: ObjectId("5cffef5ebecb4e207d44eb42"),
      name: "Notes",
      alias: "notes",
      purpose: "Keep track of your notes for this goal",
      sections: [
        {
          name: "Notes",
          header: "Notes",
          fields: [
            { header: "", entries: [{ type: "text", isOptional: true }] }
          ]
        }
      ]
    },
    {
      _id: ObjectId("5cffef5ebecb4e207d44eb43"),
      name: "Safety Plan",
      alias: "safety-plan",
      title: "Safety Plan Worksheet",
      purpose:
        "Providers and patients complete Safety Plan together, and patients keep it with them",
      sections: [
        {
          name: "Warning signs",
          header:
            "Warning signs (that I might be headed toward a crisis and the Safety Plan should be used)",
          fields: [
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] }
          ]
        },
        {
          name: "Internal coping strategies",
          header:
            "Internal coping strategies (things I can do to distract from my problems without contacting another person)",
          fields: [
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] }
          ]
        },
        {
          name: "Healthy distractions",
          header:
            "People, places and social settings that provide healthy distraction (and help me feel better)",
          fields: [
            {
              header: "Person",
              entries: [{ type: "contact" }]
            },
            {
              header: "Person",
              entries: [{ type: "contact" }]
            },
            {
              header: "Place",
              entries: [{ type: "text", placeholder: "Address" }]
            },
            {
              header: "Place",
              entries: [{ type: "text", placeholder: "Address" }]
            }
          ]
        },
        {
          name: "Personal contacts",
          header:
            "People I can contact to ask for help (family members, friends and co-workers)",
          fields: [
            {
              entries: [{ type: "contact" }]
            },
            {
              entries: [{ type: "contact" }]
            },
            {
              entries: [{ type: "contact" }]
            },
            {
              entries: [{ type: "contact" }]
            }
          ]
        },
        {
          name: "Profressional contacts",
          header: "Professionals or agencies that can help me during a crisis",
          fields: [
            {
              header: "Clinician/Agency",
              entries: [{ type: "contact" }]
            },
            {
              header: "Clinician/Agency",
              entries: [{ type: "contact" }]
            },
            {
              header: "Local Emergency Department",
              entries: [
                { type: "text", placeholder: "Location/address" },
                { type: "contact" }
              ]
            },
            {
              header: "Other",
              entries: [{ type: "contact" }]
            },
            {
              entries: [
                {
                  type: "contact",
                  value: {
                    name: "National Suicide Prevention Lifeline",
                    primary: 0,
                    contactInfo: [
                      {
                        contact: "8002738255",
                        method: "phone"
                      }
                    ]
                  },
                  isOptional: true
                }
              ]
            },
            {
              entries: [
                {
                  type: "contact",
                  value: {
                    name: "OneSource Crisis Line",
                    primary: 0,
                    contactInfo: [
                      {
                        contact: "8003429647",
                        method: "phone"
                      },
                      {
                        contact:
                          "https://www.militaryonesource.mil/all-the-ways/",
                        method: "web"
                      }
                    ]
                  },
                  isOptional: true
                }
              ]
            }
          ]
        },
        {
          name: "Safe environment",
          header:
            "Making my environment safe (plans for removing or limiting access to lethal means)",
          fields: [
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] }
          ]
        },
        {
          name: "Reasons for living",
          header:
            "My reasons for living (things that are most important to me and worth living for)",
          fields: [
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] },
            { entries: [{ type: "text" }] }
          ]
        }
      ]
    }
  ],

  saferdialogues: [
    {
      alias: "Goal_SuicidePrevention_Node_Root",
      intro: "Pick a common concern, or ask your own question:",
      question: "What kind of help do you need?",
      speech: ["Hello! What kind of help do you need?"],
      type: "Link",
      nodes: [
        "Goal_SuicidePrevention_Node_HurtSelfRisk",
        "Goal_SuicidePrevention_Node_FriendHurtRisk",
        "Goal_SuicidePrevention_Node_FriendHurtNow",
        "Goal_SuicidePrevention_Node_SelfSuicideIdeation"
      ],
      content: undefined
    },
    {
      alias: "Goal_SuicidePrevention_Node_HurtSelfRisk",
      intro: "I'm thinking about hurting myself.",
      question: "I'm thinking about hurting myself.",
      speech: ["Admitting this takes a lot of courage. Let's get you help."],
      type: "Link",
      nodes: ["Goal_SuicidePrevention_Node_HurtSelfRisk_Shelf"],
      content: undefined
    },
    {
      alias: "Goal_SuicidePrevention_Node_HurtSelfRisk_Shelf",
      intro: "I'm thinking about hurting myself.",
      question: "I'm thinking about hurting myself.",
      speech: ["Admitting this takes a lot of courage. Let's get you help."],
      type: "Shelf",
      nodes: [],
      content: {
        type: "Text",
        value: `First, if you have already hurt yourself, [call 911](tel:911) or your command's emergency line immediately. You may also be able to [text 911](sms:911).
  \nNo matter how bad it seems right now, these feelings are temporary. Remember the people and things in your life that are important to you.
  \nSecond, if you're all alone, call or text a good friend or family member right now. There is somebody out there who wants to talk to you and hear you are okay. Invite them over, even if it is late at night.
  \nThird, reach out to a trained counselor. You can talk confidentially 24/7 at the Veterans Crisis Line as a start. They can recommend more resources, or you can also check here on the app.
  \n+ **Suicide Prevention Lifeline** at [800-273-TALK (800-273-8255)](tel:8002738255), press "1" for the Veterans Crisis Line.
  \n+ **Veterans Crisis Chat**: [www.veteranscrisisline.net/get-help-now/chat/](http://www.veteranscrisisline.net/get-help-now/chat/)
  \n![Veterans Crisis Line](https://www.legion.org/images/legion/suicideprevention/crisis_header4.jpg)
  \nFinally, above all else: get help. Your life is more than the Navy, and you deserve a life after your Navy service. Asking for help is a sign of strength. It's about using your Navy team to be stronger and healthier.`
      }
    },
    {
      alias: "Goal_SuicidePrevention_Node_FriendHurtRisk",
      intro: "Someone I know is thinking about hurting themself.",
      question: "Someone I know is thinking about hurting themself.",
      speech: [
        "Understood. Stay with them 100% of the time if they might get hurt."
      ],
      type: "Link",
      nodes: [
        "Goal_SuicidePrevention_Node_SeriouslyHurt",
        "Goal_SuicidePrevention_Node_24Hours",
        "Goal_SuicidePrevention_Node_Worried"
      ],
      content: undefined
    },
    {
      alias: "Goal_SuicidePrevention_Node_SeriouslyHurt",
      intro: "Someone I know is seriously hurt.",
      question: "Are they seriously hurt?",
      speech: [
        "This sounds like an emergency. Stay with them and call for help."
      ],
      type: "Shelf",
      nodes: [],
      content: {
        type: "Text",
        value: `[Call 911](tel:911) or your command's emergency line immediately if someone you know is hurt. You may also be able to [text 911](sms:911).
  \nStay directly with them if you can to help talk to emergency services or prevent more injuries. Additionally, if possible, reach out to one of their close family or friends to rally additional support. You should also contact the chain of command to respond to the crisis when you can.
  \nEmergency issues include any unstopped bleeding, poisoning (including alcohol or drug overdose), smoke or carbon monoxide inhalation, breathing problems, unconsciousness, drowning, sudden confusion or drowsiness, or a genuine urge to kill yourself or others.
        `
      }
    },
    {
      alias: "Goal_SuicidePrevention_Node_24Hours",
      intro: "Someone I know is seriously hurt.",
      question:
        "Are you worried they might hurt themselves now or in the next 24 hours?",
      speech: [
        "This sounds like a potential crisis situation. Maintain contact."
      ],
      type: "Shelf",
      nodes: [],
      content: {
        type: "Text",
        value: `If someone is having a mental health crisis, the first steps are to ensure they are not left alone and that they are in a safe environment (securing or moving to a place without guns, drugs, etc.).
  \nEncourage them to talk and avoid interrupting. Show that you respect their feelings and that you care, even if you don't see things the same way.
  \nIf possible, also reach out to one of their close family or friends to help with additional support. This is particularly important if you cannot be there in person or if they need another person who they trust to help. In some cases, it can also be safer to get them out of their house during the crisis, since they are most likely to know where lethal items are in their own home.
  \nIf the situation escalates to an immediate risk or they have already hurt themselves:
  \n- [Call 911](tel:911) for emergency assistance
  \n- Stay with them at all times, as they may have a gun or other lethal items you do not know about
  \nEncourage them to get help from a mental health professional, a crisis line, or from other trained counseling services (e.g., chaplain). For someone near a crisis, the Veterans Crisis Line is available:
  \n- **Suicide Prevention Lifeline** at [800-273-TALK (800-273-8255)](tel:8002738255), press "1" for the Veterans Crisis Line.  A trained responder will answer your call. The responder will ask you a few questions, such as whether you or the Veteran or Service member you’re concerned about may be in immediate danger or at risk for suicide. You will decide what to share about yourself and what you want to talk about.
  \n- **Veterans Crisis Chat**: [www.veteranscrisisline.net/get-help-now/chat/](http://www.veteranscrisisline.net/get-help-now/chat/)
  \n![Veterans Crisis Line](https://www.legion.org/images/legion/suicideprevention/crisis_header4.jpg)
  \nIf they are not interested in a dedicated crisis or suicide hotline, other options include:
  \n- **Military OneSource**: [1-800-342-9647](tel:18003429647) or [livechat.militaryonesourceconnect.org/chat/](https://livechat.militaryonesourceconnect.org/chat/)\n(OCONUS check: [www.militaryonesource.mil/international-calling-options/](http://www.militaryonesource.mil/international-calling-options/))
  \n- **Navy Chaplain Line**: Navy 311 at [1-855-NAVY-311](tel:18556289311) or [text Navy311@navy.mil](sms:Navy311@navy.mil)
  \n- **Navy Reserves Chaplain Line**: [757-322-5650](tel:7573225650)
  \n- **Base-Specific Services**: See [https://installations.militaryonesource.mil/](https://installations.militaryonesource.mil/)
        `
      }
    },
    {
      alias: "Goal_SuicidePrevention_Node_Worried",
      intro: "I am worried about someone in general.",
      question: "Are you worried about someone in general?",
      speech: ["Watching someone struggle is hard. Don't go it alone."],
      type: "Shelf",
      nodes: [],
      content: {
        type: "Text",
        value: `If you are worried about someone (e.g., depressed for a long time, concerning changes in mood), but they don't seem to be in a crisis right now, then there are many options to help. If you are concerned they might be at risk now, stay with them and encourage them to get specialized help, such as Veterans Crisis Line at [(800-273-TALK (800-273-8255)](tel:8002738255), option "1".
  \nThe training in this program should help you to be a better helper (e.g., Reaching Out, Warning Signs, Emergency Suicide Response, Effective Conversations), which go into more details. In general, you will want to talk with them, listen to where they are at, and show them that you care. This will help you understand their situation and also what kinds of help they are open to trying.
  \nIf you are looking for resources to help them, you could talk through what kinds of professionals that they are open to trying. For sailors and other military personnel, some options include:
  \n- **Mental Health Clinicians**: Seeking a doctor's referral for a clinical psychologist or psychiatrist who are used to working with veterans, at [1-800-TRICARE](tel:18004445445) (Option 1) or [www.tricare.mil/FindDoctor/Appointments](http://www.tricare.mil/FindDoctor/Appointments). This can be a longer process to set up, but can open up access to both military and private practice mental health specialists.
  \n- **Military OneSource**: To speak with trained counselors on a variety of issues on-demand, you can suggest [1-800-342-9647](tel:18003429647) or [livechat.militaryonesourceconnect.org/chat/](https://livechat.militaryonesourceconnect.org/chat/)\n(OCONUS check: [www.militaryonesource.mil/international-calling-options/](http://www.militaryonesource.mil/international-calling-options/)) 
  \n- **Navy Chaplain Line**: Navy 311 at [1-855-NAVY-311](tel:18556289311) or [text Navy311@navy.mil](sms:Navy311@navy.mil)
  \n- **Navy Reserves Chaplain Line**: For sailors in the reserves, you can call [757-322-5650](tel:7573225650)
  \n- **Fleet and Family Services**: Schedule appointments with counselors who can work with both family and individual issues. [www.cnic.navy.mil/ffr/family_readiness/fleet_and_family_support_program/FFSC.html](https://www.cnic.navy.mil/ffr/family_readiness/fleet_and_family_support_program/FFSC.html)
  \n- **Base-Specific Services**: See [https://installations.militaryonesource.mil/](https://installations.militaryonesource.mil/)
  \nIf you are a family member or friend who does not know how to get help for a sailor at risk, you may also contact the Red Cross Services who can send a message to their command: [1-877-272-7337](tel:18772727337) or online at [www.redcross.org/get-help/military-families/emergency-communication.html](http://www.redcross.org/get-help/military-families/emergency-communication.html)
  `
      }
    },
    {
      alias: "Goal_SuicidePrevention_Node_FriendHurtNow",
      intro: "Someone is injured and it might be an emergency.",
      question: "Someone is injured and it might be an emergency.",
      speech: [],
      type: "Link",
      nodes: ["Goal_SuicidePrevention_Node_SeriouslyHurt"],
      content: undefined
    },
    {
      alias: "Goal_SuicidePrevention_Node_SelfSuicideIdeation",
      intro: "I've been thinking about dying and want help.",
      question: "I've been thinking about dying and want help.",
      speech: [
        "Seeking help is a sign of strength. Let's pull up some resources."
      ],
      type: "Link",
      nodes: ["Goal_SuicidePrevention_Node_SelfSuicideIdeation_Shelf"],
      content: undefined
    },
    {
      alias: "Goal_SuicidePrevention_Node_SelfSuicideIdeation_Shelf",
      intro: "I've been thinking about dying and want help.",
      question: "I've been thinking about dying and want help.",
      speech: [
        "Seeking help is a sign of strength. Let's pull up some resources."
      ],
      type: "Shelf",
      nodes: [],
      content: {
        type: "Text",
        value: `Navy jobs have occupational stress that go beyond what you see in most professions. However, no sailor should have to think about hurting themselves and we want you to get the help that you need.
  \nFirst, if you do start to feel that you might hurt yourself right now, you can talk confidentially 24/7 at the Veterans Crisis Line at [(800-273-TALK (800-273-8255)](tel:8002738255), option "1" or chat at [www.veteranscrisisline.net/get-help-now/chat/](http://www.veteranscrisisline.net/get-help-now/chat/).
  \nYou should also reach out to multiple longer term options who can help you track and improve your situation over time. Some of these can be fully anonymous (e.g., Chaplain, OneSource, Veterans Crisis Line). Others have specialized training to help you work through issues, such as clinical psychologists.
  \n- **Mental Health Clinicians**: Seeking a doctor's referral for a clinical psychologist or psychiatrist who are used to working with veterans, at [1-800-TRICARE](tel:18004445445) (Option 1) or [www.tricare.mil/FindDoctor/Appointments](http://www.tricare.mil/FindDoctor/Appointments). This can be a longer process to set up, but can open up access to both military and private practice mental health specialists.
  \n- **Military OneSource**: To speak with trained responders on a variety of issues on-demand, you can suggest [1-800-342-9647](tel:18003429647) or [livechat.militaryonesourceconnect.org/chat/](https://livechat.militaryonesourceconnect.org/chat/)\n(OCONUS check: [www.militaryonesource.mil/international-calling-options/](http://www.militaryonesource.mil/international-calling-options/))
  \n- **Navy Chaplain Line**: Navy 311 at [1-855-NAVY-311](tel:18556289311) or text [Navy311@navy.mil](sms:Navy311@navy.mil)
  \n- **Navy Reserves Chaplain Line**: For sailors in the reserves, you can call [757-322-5650](tel:7573225650)
  \n- **Fleet and Family Services**: Schedule appointments with counselors who can work with both family and individual issues. [www.cnic.navy.mil/ffr/family_readiness/fleet_and_family_support_program/FFSC.html](https://www.cnic.navy.mil/ffr/family_readiness/fleet_and_family_support_program/FFSC.html)
  \n- **Base-Specific Services**: See [https://installations.militaryonesource.mil/](https://installations.militaryonesource.mil/)
  \nIn general, you should seek out the strongest set of services that you feel comfortable using. For systems that take more work to set up, get a trusted friend to help you discuss options and help with logistics.
  \nFinally, the training in this program should help you to plan ahead for safety (e.g., Safety Plans, Warning Signs, Support Systems). These modules are focused on building resilience, by building layers of safety nets. 
        `
      }
    }
  ],

  users: [
    {
      _id: ObjectId("5dd88892c012321c14267155"),
      name: "kcarr",
      nameLower: "kcarr",
      email: "kcarr@ict.usc.edu",
      password: "$2a$10$RigOzUVHdGIpqsObXel8bu9psmyWKgHCXLhmflZy6qyKN0tYsCKam"
    },
    {
      _id: ObjectId("5dd88892c012321c14267156"),
      name: "larry",
      nameLower: "larry",
      email: "kirschner@ict.usc.edu",
      password: "$2a$10$RigOzUVHdGIpqsObXel8bu9psmyWKgHCXLhmflZy6qyKN0tYsCKam"
    },
    {
      _id: ObjectId("5bf4a366becb4e208de99092"),
      name: "Expert",
      nameLower: "expert",
      email: "expert@pal.ict.usc.edu",
      password: "acceptsanything"
    },
    {
      _id: ObjectId("5bf4a366becb4e208de99099"),
      name: "DeletedUser",
      nameLower: "deleteduser",
      email: "deleteduser@pal.ict.usc.edu",
      password: "acceptsanything",
      deleted: true
    }
  ],

  useraccesstokens: [
    {
      _id: ObjectId("5bf4a366becb4e208de99091"),
      accessToken: "82189440-16fc-11ea-996e-321c14267155",
      resetPasswordToken: "resetpasswordtoken",
      resetPasswordExpires: new Date("3000-05-14T11:01:58.135Z"),
      user: ObjectId("5dd88892c012321c14267155")
    },
    {
      _id: ObjectId("5bf4a366becb4e208de99093"),
      accessToken: "82189440-16fc-11ea-996e-321c14267156",
      resetPasswordToken: "token",
      resetPasswordExpires: new Date("3000-05-14T11:01:58.135Z"),
      user: ObjectId("5dd88892c012321c14267156")
    },
    {
      _id: ObjectId("5df9570b3440520012cd80ac"),
      accessToken: "2f8ee6a0-ed24-11e8-a8a9-4e208de99092",
      resetPasswordToken: "expiredtoken",
      resetPasswordExpires: new Date("2000-05-14T11:01:58.135Z"),
      user: ObjectId("5bf4a366becb4e208de99092")
    }
  ],

  usercohorts: [
    {
      user: ObjectId("5dd88892c012321c14267156"),
      cohort: ObjectId("5ed82fb2a869c32825c74474"),
      updatedAt: "1999-06-05T06:21:34.411Z"
    }
  ],

  goalcohorts: [
    {
      _id: ObjectId("5d9dfde2becb4e208d59dc4d"),
      goal: ObjectId("5b5a2cd69b1fafcf999d957e"),
      membersMax: 30,
      memberSlotsRemaining: 27,
      members: [
        {
          teamIndex: 0,
          user: ObjectId("5dd88892c012321c14267155"),
          id: ObjectId("5d9dfde2ec2b930013f84dd0")
        },
        {
          teamIndex: 0,
          user: ObjectId("5dd88892c012321c14267156"),
          id: ObjectId("5d9dfde2ec2b930013f84dd2")
        },
        {
          teamIndex: 1,
          user: ObjectId("5bf4a366becb4e208de99092"),
          id: ObjectId("5d9e30b8ec2b930013f84ded")
        }
      ],
      teams: [
        {
          id: ObjectId("5d9dfde2ec2b930013f84dcf"),
          name: "Minnows",
          icon: "LogoTeamRazorfish"
        },
        {
          id: ObjectId("5d9dfde2ec2b930013f84dce"),
          name: "WaveMakers",
          icon: "LogoTeamZephyr",
          inviteCode: "lTQ2Uf_LJ"
        }
      ]
    },
    {
      _id: ObjectId("5d9dfde2becb4e278d59dc4d"),
      goal: ObjectId("5b5a2cd69b1fafcf999d957e"),
      membersMax: 30,
      memberSlotsRemaining: 30,
      members: [],
      teams: [
        {
          id: ObjectId("5d9dfde2ec2b930013f84dcf"),
          name: "Minnows",
          icon: "LogoTeamRazorfish"
        },
        {
          id: ObjectId("5d9dfde2ec2b930013f84dce"),
          name: "WaveMakers",
          icon: "LogoTeamZephyr",
          inviteCode: "rPT4wj_QT"
        }
      ]
    },
    {
      goal: ObjectId("5b5a2cd69b1fafcf999d957e"),
      cohort: ObjectId("5ed82fb2a869c32825c74474"),
      membersMax: 30,
      memberSlotsRemaining: 30,
      members: [],
      teams: [
        {
          name: "Minnows",
          icon: "LogoTeamRazorfish",
          inviteCode: "lUYoW3tLo"
        }
      ]
    },
    {
      _id: ObjectId("5df95a108878787d7708ec53"),
      goal: ObjectId("5bb6540cbecb4e208da0fb65"),
      membersMax: 10,
      memberSlotsRemaining: 10,
      members: [],
      teams: [
        {
          id: ObjectId("5df95a103440520012cd80b1"),
          name: "RedSquad",
          icon: "LogoTeamGladiator",
          inviteCode: "lUYoW3tLo"
        },
        {
          id: ObjectId("5df95a103440520012cd80b0"),
          name: "ShipsAhoy",
          icon: "LogoTeamLighthouse",
          inviteCode: "lTQ2Uf_LJ"
        }
      ]
    },
    {
      _id: ObjectId("5df95a108878787d7708ec54"),
      goal: ObjectId("5bb6540cbecb4e208da0fb64"),
      membersMax: 30,
      memberSlotsRemaining: 0,
      members: [],
      teams: [
        {
          name: "Minnows",
          icon: "LogoTeamRazorfish",
          inviteCode: "lTQ2Uf_LJ"
        },
        {
          name: "WaveMakers",
          icon: "LogoTeamZephyr"
        },
        {
          name: "Hurricane",
          icon: "LogoTeamSquall"
        },
        {
          name: "ShipsAhoy",
          icon: "LogoTeamLighthouse"
        },
        {
          name: "RedSquad",
          icon: "LogoTeamGladiator"
        },
        {
          name: "ElectricForce",
          icon: "LogoTeamFirebolt"
        }
      ]
    },
    {
      _id: ObjectId("5df95a10887878ed7708ec54"),
      goal: ObjectId("5bb6540cbecb4e208da0fb64"),
      cohort: ObjectId("5ed86dbe14f1e930dcd03ec9"),
      membersMax: 30,
      memberSlotsRemaining: 0,
      members: [],
      teams: [
        {
          name: "Minnows",
          icon: "LogoTeamRazorfish"
        },
        {
          name: "WaveMakers",
          icon: "LogoTeamZephyr"
        },
        {
          name: "Hurricane",
          icon: "LogoTeamSquall"
        },
        {
          name: "ShipsAhoy",
          icon: "LogoTeamLighthouse"
        },
        {
          name: "RedSquad",
          icon: "LogoTeamGladiator"
        },
        {
          name: "ElectricForce",
          icon: "LogoTeamFirebolt"
        }
      ]
    },
    {
      goal: ObjectId("5bb6540cdecb4e208da0fb64"),
      cohort: ObjectId("5edaa35f7b3a751d291f9932"),
      membersMax: 5,
      memberSlotsRemaining: 1,
      members: [],
      teams: [
        {
          name: "RedSquad",
          icon: "LogoTeamGladiator"
        }
      ]
    }
  ]
};
