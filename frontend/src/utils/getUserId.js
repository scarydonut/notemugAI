export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("notegenius-user"));
  return user?._id || localStorage.getItem("userId");
};
