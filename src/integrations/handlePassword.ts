import bcrypt from "bcrypt";

export const comparePassword = async (password: string, password2: string) => {
  return await bcrypt.compare(password, password2);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
