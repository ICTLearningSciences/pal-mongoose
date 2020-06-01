function ensureAllSchemasLoaded() {
  // doesn't need to do anything just be importable
}

module.exports = {
  ensureAllSchemasLoaded,
  AppVersions: require("./AppVersions"),
  Career: require("./Career"),
  DemoUser: require("./DemoUser"),
  Goal: require("./Goal"),
  GoalCohort: require("./GoalCohort"),
  KnowledgeComponent: require("./KnowledgeComponent"),
  Lesson: require("./Lesson"),
  MultipleChoiceQuestion: require("./MultipleChoiceQuestion"),
  Resource: require("./Resource"),
  Topic: require("./Topic"),
  User: require("./User"),
  UserAccessToken: require("./UserAccessToken"),
  UserCareer: require("./UserCareer"),
  UserGoal: require("./UserGoal"),
  UserCohort: require("./UserCohort"),
  UserKnowledgeComponent: require("./UserKnowledgeComponent"),
  UserLessonSession: require("./UserLessonSession"),
  plugins: require("./plugins"),
  schema: require("./schema"),
  utils: require("./utils")
};
