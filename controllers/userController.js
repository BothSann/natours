import catchAsync from "./../utils/catchAsync.js";
import User from "./../models/userModel.js";

export const getAllUsers = catchAsync(async (request, response, next) => {
  const allUsers = await User.find();

  response.status(200).json({
    status: "success",
    length: allUsers.length,
    data: {
      users: allUsers,
    },
  });
});

export const getUserById = (request, response) => {
  response.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

export const createUser = (request, response) => {
  response.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

export const updateUser = (request, response) => {
  response.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

export const deleteUser = (request, response) => {
  response.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
