import * as usersService from "./users.service.js";

export const getUsers = async (req, res) => {
  const users = await usersService.getUsers();

  res.json(users);
};

export const createUser = async (req, res) => {
  const user = await usersService.createUser(req.body);

  res.status(201).json(user);
};
