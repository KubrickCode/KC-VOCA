import { IsNickname, IsPassword } from "./auth.dto";

export class deleteUserDto {
  @IsPassword()
  password: string = "";
}

export class changeNicknameDto {
  @IsNickname()
  nickname: string = "";
}

export class changePasswordDto {
  @IsPassword()
  password: string = "";

  @IsPassword()
  prevPassword: string = "";
}
