import { IsNickname, IsPassword } from "./auth.dto";

export class deleteUserDto {
  @IsPassword()
  password: string = "";
}

export class updateUserDto {
  @IsPassword()
  password: string = "";

  @IsPassword()
  prevPassword: string = "";

  @IsNickname()
  nickname: string = "";
}
