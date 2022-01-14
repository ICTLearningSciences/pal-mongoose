/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 
No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import * as mongoose from "mongoose";
// TODO: make the pal-mongoose module export types, until then just fill in here as needed
declare module "pal-mongoose" {
  /**
   * For app code that might loads models by name
   * rather than explicit import,
   * call this function first to make sure all the
   * schemas have been loaded, e.g.
   */
  export function ensureAllSchemasLoaded(): void;

  export interface PaginatedResolveResult<T> {
    items: T[];
    hasMore: boolean;
  }

  export class AppVersions extends mongoose.Model {
    platform: string;
    appId: boolean;
    appUpdateUrl: boolean;
    versionMin: string;
    versionLatest: string;
    versions: { version: string; notes: string }[];
  }

  export class Career extends mongoose.Model {
    alias: string;
    pronunciation: string;
    defaultSuggested: boolean;
    deleted: boolean;
    desc: string;
    name: string;
    ord: number;
    suggestedGoals: mongoose.Types.ObjectId[];

    static findSuggested: () => Promise<Career>;
    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Career>>;
  }

  export class Cohort extends mongoose.Model {
    name: string;
    nameCanonical: string;

    static findForName: (name: string) => Promise<Cohort>;
    static findOrCreateForName(name: string): Promise<Cohort>;
    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Cohort>>;
  }

  export class DemoUser extends mongoose.Model {
    goal: mongoose.Types.ObjectId;
    focus: mongoose.Types.ObjectId;
    topic: mongoose.Types.ObjectId;
  }

  export interface Focus {
    desc: string;
    name: string;
    pronunciation: string;
    topics: mongoose.Types.ObjectId[];
  }

  export class Goal extends mongoose.Model {
    alias: string;
    pronunciation: string;
    desc: string;
    focusList: [Focus];
    name: string;

    findAllKnowledgeComponents: () => { [kc: string]: string };
    findFocusByIdOrAlias: (idOrAlias: string) => Focus | null;
    findUniqueTopicIds: () => mongoose.Types.ObjectId[];
    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Goal>>;
  }

  export interface GoalCohortTeam {
    icon: string;
    inviteCode: string;
    name: string;
  }

  export interface GoalCohortMember {
    user: mongoose.Types.ObjectId;
    teamIndex: number;
  }

  export class GoalCohort extends mongoose.Model {
    goal: mongoose.Types.ObjectId;
    cohort: mongoose.Types.ObjectId;
    members: GoalCohortMember[];
    membersMax: number;
    memberSlotsRemaining: number;
    teams: GoalCohortTeam[];

    static createTeam: (
      user: User,
      goal: Goal,
      teamName: string
    ) => Promise<GoalCohort>;

    static findUserCohort: (user: User, goal: Goal) => Promise<GoalCohort>;

    static invite: (
      user: User,
      goal: Goal,
      teamName: string
    ) => Promise<GoalCohort>;

    static joinWithInvite: (
      user: User,
      goal: Goal,
      code: string
    ) => Promise<GoalCohort>;

    static joinOrCreate: (
      user: User,
      goal: Goal,
      opts: {
        new_cohort_teams: any;
        new_cohort_max_members_per_team: number;
        sort_users_onto_teams: () => {};
      }
    ) => Promise<GoalCohort>;

    static kickMember: (
      user: User,
      goal: Goal,
      memberId: mongoose.Types.ObjectId
    ) => Promise<GoalCohort>;

    static leaveCohort: (user: User, goal: Goal) => Promise<GoalCohort>;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<GoalCohort>>;
  }

  export interface KnowledgeComponentRelevance {
    kc: mongoose.Types.ObjectId;
    relevance: number;
  }

  export class KnowledgeComponent extends mongoose.Model {
    alias: string;
    desc: string;
    name: string;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<KnowledgeComponent>>;
  }

  export class Lesson extends mongoose.Model {
    alias: string;
    pronunciation: string;
    deleted: boolean;
    desc: string;
    displayType: string;
    downloadable: boolean;
    estMinHigh: number;
    estMinLow: number;
    ord: number;
    name: string;
    resources: mongoose.Types.ObjectId[];
    topic: mongoose.Types.ObjectId;
    type: string;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Lesson>>;
  }

  export class MultipleChoiceQuestion extends mongoose.Model {
    alias: string;
    answers: {
      answerText: string;
      correctAnswerFeedback: string;
      isCorrect: boolean;
      wrongAnswerFeedback: string;
    }[];
    hint: { content: string }[];
    question: {
      template: string;
      data: any;
    };
    name: string;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<MultipleChoiceQuestion>>;
  }

  export class Resource extends mongoose.Model {
    alias: string;
    pronunciation: string;
    assets: {
      name: string;
      type: string;
      uri: string;
    }[];
    contentType: string;
    duration: number;
    isCmiAU: boolean;
    explorationLevel: number;
    knowledgeComponents: KnowledgeComponentRelevance[];
    name: string;
    type: string;
    uri: string;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Resource>>;
  }

  export class Topic extends mongoose.Model {
    alias: string;
    pronunciation: string;
    name: string;
    recommender: string;
    knowledgeComponents: KnowledgeComponentRelevance[];
    prerequisiteTopics: mongoose.Types.ObjectId[];

    findLessons: () => Promise<Lesson[]>;
    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Topic>>;
  }

  export class Plan extends mongoose.Model {
    name: string;
    title: string;
    purpose: string;
    sections: {
      name: string;
      header: string;
      fields: {
        header: string;
        entries: {
          type: string;
          placeholder: string;
          isOptional: boolean;
          value: any;
        }[];
      }[];
    }[];

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<Plan>>;
  }

  export class User extends mongoose.Model {
    creationDeviceId: string;
    deleted: boolean;
    deletedReason: string;
    email: string;
    lastDeviceId: string;
    lastLoginAt: Date;
    name: string;
    nameLower: string;
    password: string;
    type: string;

    static authenticate: (accessToken: string) => Promise<User | null>;

    static deleteAccount: (reason: string) => Promise<User>;

    static findActive: (query: any) => Promise<User[]>;

    static findActiveById: (
      userId: string | mongoose.Types.ObjectId
    ) => Promise<User>;

    static findOneActive: (query: any) => Promise<User>;

    isDemoUser: () => boolean;

    static isEmailAvailable: (userName: string) => Promise<boolean>;

    static isUserNameAvailable: (userName: string) => Promise<boolean>;

    static login: (
      userId: string | mongoose.Types.ObjectId,
      deviceId: string
    ) => Promise<User>;

    static loginWithCredentials: (
      userNameOrEmail: string,
      password: string,
      deviceId: string
    ) => Promise<User>;

    static resetPassword: (userName: string, password: string) => Promise<User>;

    static signUpWithCredentials: (
      userName: string,
      password: string,
      email: string,
      deviceId: string
    ) => Promise<User>;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<User>>;
  }

  export interface UserAccessTokenResolveResult {
    accessToken: string;
    user: User;
  }

  export class UserAccessToken extends mongoose.Model {
    accessToken: string;
    resetPasswordExpires: Date;
    resetPasswordToken: string;
    user: mongoose.Types.ObjectId;

    static loginWithCredentials: (
      username: string,
      password: string,
      deviceId: string
    ) => Promise<UserAccessTokenResolveResult>;
    static signUpWithCredentials: (
      username: string,
      password: string,
      email: string,
      deviceId: string
    ) => Promise<UserAccessTokenResolveResult>;
    static resetPassword: (
      token: string,
      password: string
    ) => Promise<UserAccessTokenResolveResult>;
    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<UserAccessToken>>;
  }

  export class UserCohort extends mongoose.Model {
    cohort: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;

    static findForUser: (user: User) => Promise<UserCohort>;

    static setUserCohort: (user: User, cohort: string) => Promise<void>;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<UserCohort>>;
  }

  export class UserGoal extends mongoose.Model {
    activeFocus: string;
    activeGoal: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;

    static findForUser: (user: User) => UserGoal;

    static saveGoalAndFocus: (
      user: User,
      goal: string,
      focus?: string
    ) => Promise<void>;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<UserGoal>>;
  }

  export class UserKnowledgeComponent extends mongoose.Model {
    asymptote: number;
    avgTimeDecay: number;
    kc: mongoose.Types.ObjectId;
    mastery: number;
    timestamp: Date;

    static insertOrUpdateIfNewer: (
      user: User,
      kc: KnowledgeComponent,
      update: {
        mastery: number;
        timestamp: Date;
        avgTimeDecay: number;
        asymptote: number;
      }
    ) => Promise<void>;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<UserKnowledgeComponent>>;
  }

  export class UserLessonSession extends mongoose.Model {
    user: mongoose.Types.ObjectId;
    lesson: mongoose.Types.ObjectId;
    resourceStatuses: {
      isTerminationPending: boolean;
      resource: mongoose.Types.ObjectId;
    };
    session: string;

    static findOneByUserAndSession: (
      user: User,
      session: string
    ) => Promise<UserLessonSession>;

    static isResourceTerminationPending: (
      user: User | string | mongoose.Types.ObjectId,
      session: string,
      resource: Resource | string | mongoose.Types.ObjectId
    ) => Promise<boolean>;

    static saveUserLessonSession: (
      user: User,
      session: string,
      lesson: Lesson
    ) => Promise<UserLessonSession>;

    static setResourceTerminationPending: (
      user: User | string | mongoose.Types.ObjectId,
      session: string,
      resource: Resource | string | mongoose.Types.ObjectId,
      terminationPending?: boolean
    ) => Promise<UserLessonSession>;

    static paginate: (
      query?: any,
      options?: any,
      callback?: any
    ) => Promise<PaginatedResolveResult<UserLessonSession>>;
  }
}
