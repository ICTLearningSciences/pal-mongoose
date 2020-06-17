const mongoose = require("./utils/mongoose");
const Schema = mongoose.Schema;

/**
 * Subdocument for a the question
 */
const Question = new Schema({
  template: { type: String, required: "{PATH} is required!" },
  data: { type: Schema.Types.Mixed, required: "{PATH} is required!" }
});
Question.plugin(require("mongoose-cursor-pagination").default);

/**
 * Subdocument for a an answer
 */
const Answer = new Schema({
  answerText: { type: String },
  isCorrect: { type: Boolean },
  wrongAnswerFeedback: { type: String },
  correctAnswerFeedback: { type: String }
});
Answer.plugin(require("mongoose-cursor-pagination").default);

/**
 * Subdocument for a hint in the hints list for this question
 */
const Hint = new Schema({
  content: { type: String } // TODO: maybe a ref to a lesson (model)
});
Hint.plugin(require("mongoose-cursor-pagination").default);

const MultipleChoiceQuestion = new Schema(
  {
    name: { type: String, required: "{PATH} is required!" },
    alias: { type: String, required: "{PATH} is required!", unique: true },
    question: { type: Question, required: "{PATH} is required!" },
    answers: [Answer],
    relatedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    hints: [Hint]
  },
  { timestamps: true }
);

MultipleChoiceQuestion.plugin(
  require("./plugins/mongoose-find-one-by-id-or-alias")
);
MultipleChoiceQuestion.plugin(require("./plugins/mongoose-no-underscore-id"));
MultipleChoiceQuestion.plugin(require("mongoose-findorcreate"));
MultipleChoiceQuestion.plugin(require("mongoose-cursor-pagination").default);

module.exports = mongoose.model(
  "MultipleChoiceQuestion",
  MultipleChoiceQuestion
);
