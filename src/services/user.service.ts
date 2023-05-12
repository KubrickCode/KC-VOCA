import User from "../models/queries/User";

export const getUserService = async (user_id: number) => {
  const [user] = await User.getUserById(user_id);
  const { id, email, nickname, registration_date } = user;
  return { id, email, nickname, registration_date };
};

export const updateUserService = async (
  id: number,
  nickname: string,
  password: string,
  prevPassword: string
) => {
  if (nickname) {
    const result = await User.checkNickname(nickname);
    if (result) {
      await User.updateUser(id, nickname, "nickname");
    } else {
      return { message: "이미 존재하는 닉네임입니다" };
    }
  }
  if (password) {
    const result = await User.checkPassword(id, prevPassword);
    if (result) {
      await User.updateUser(id, password, "password");
    } else {
      return { message: "기존 비밀번호를 확인해주세요" };
    }
  }
};

export const deleteUserService = async (id: number, password: string) => {
  const result = await User.checkPassword(id, password);
  if (result) {
    await User.deleteUser(id);
    return true;
  } else {
    return false;
  }
};
