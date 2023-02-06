const dayjs = require("dayjs");

const modifyUser = (user) => {
  console.log(user);
  return {
    name: user.name,
    email: user.email,
    dateOfBirth: dayjs(user.date_of_birth).format("YYYY-MM-DD hh:mm A"),
    created_at: dayjs(user.created_at).format("YYYY-MM-DD hh:mm A"),
  };
};

module.exports = { modifyUser };
