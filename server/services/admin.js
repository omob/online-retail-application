const { User, validateUser } = require("../models/user"); // Using User schema in the user route
const bcrypt = require("bcrypt");
const { Roles } = require("../models/roles");

const registerUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    addressline1,
    city,
    state,
    role,
  } = req.body;

  let user = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (user)
    return res
      .status(400)
      .send("User with same email or phone number already registered.");

  user = new User({
    name: {
      firstName,
      lastName,
    },
    email,
    phoneNumber,
    password,
    address: {
      line1: addressline1,
      city,
      state,
    },
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  // add user to roles
  await Roles.findOneAndUpdate(
    {},
    {
      $addToSet: {
        [role]: {
          userId: user._id.toHexString(),
        },
      },
    }
  );
  res.send("Success");
};

const getRoles = async (req, res) => {
  const roles = await (await Roles.findOne({}).select("-_id -__v")).toJSON();

  const rolesObject = Object.keys(roles).map((role) => {
    return { _id: role, name: role };
  });

  res.send(rolesObject);
};

const manageAccess = async (req, res) => {
  const { email, canLogin } = req.body;
  const result = await User.findOneAndUpdate({ email }, { canLogin: canLogin });
  res.send(result && result.canLogin);
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const userDocument = await User.findById({ _id: id }).select(
    "-password -creditCard"
  );

  if (!userDocument) return res.status(404).send("User not found");

  res.send(userDocument);
};

const getAllUsers = async (req, res) => {
  const usersInDb = await User.find({}).select("name isDeleted");

  const users = usersInDb.filter((user) => {
    return user.isDeleted == null || !user.isDeleted;
  });
  res.send(users);
};

const deleteUser = async (req, res) => {
  const { id: _id } = req.params;
  if (_id === req.user._id) return res.status(403).send("Cannot deleted Self");

  await User.findByIdAndUpdate({ _id }, { isDeleted: true });
  res.send("Deleted");
};

module.exports = {
  registerUser,
  getRoles,
  manageAccess,
  getUserProfile,
  getAllUsers,
  deleteUser,
};
