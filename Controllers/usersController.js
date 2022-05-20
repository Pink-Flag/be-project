const { selectUsers } = require("../Models/usersModel.js");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};
