const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  admin: {
    type: Array,
    userId: { type: Schema.Types.ObjectId },
  },
  moderator: {
    type: Array,
    userId: { type: Schema.Types.ObjectId },
    default: [],
  },
  editor: {
    type: Array,
    userId: { type: Schema.Types.ObjectId },
    default: [],
  },
});

const Roles = mongoose.model("Role", rolesSchema);

const initializeRoles = async () => {
  // const roles_ = new Roles();
  // await roles_.save();
};

// initializeRoles();

Roles.findOne({}).exec(async (err, roles) => {
  //   console.log(roles.admin);
  if (roles && roles.length == 0) initializeRoles();
});

// const role = new Roles({
//   admin: { userId: "5eeeb1c1a1eae950801e54f6" },
// });

// role.save((err, done) => {
//   if (err) return console.log(err);

//   console.log(done);
// });
module.exports = { Roles };
