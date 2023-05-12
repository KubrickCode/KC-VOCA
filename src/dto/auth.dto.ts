import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export const IsPassword = () => {
  return (target: any, propertyName: string) => {
    IsString({ message: "비밀번호 형식을 확인하세요" })(target, propertyName);
    Length(6, 20, { message: "비밀번호는 6자이상 20자이하로 입력하세요" })(
      target,
      propertyName
    );
    Matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/,
      { message: "비밀번호 형식을 확인하세요(영문+숫자+특수문자)" }
    )(target, propertyName);
    IsNotEmpty({ message: "비밀번호를 입력하세요" })(target, propertyName);
  };
};

export const IsNickname = () => {
  return (target: any, propertyName: string) => {
    IsString({ message: "닉네임 형식을 확인하세요" })(target, propertyName);
    Matches(/^[a-zA-Z0-9가-힣]{2,10}$/, {
      message: "닉네임 형식을 확인하세요(영문or한글or숫자)",
    });
    Length(2, 10, { message: "닉네임은 2자 이상 10자 이하로 입력하세요" })(
      target,
      propertyName
    );
    IsNotEmpty({ message: "닉네임을 입력하세요" })(target, propertyName);
  };
};

export class findPasswordDto {
  @IsEmail({}, { message: "이메일 형식을 확인하세요" })
  @Length(5, 255, { message: "이메일은 5자 이상 255자 이하로 입력하세요" })
  @IsNotEmpty({ message: "이메일을 입력하세요" })
  email: string = "";
}

export class loginDto extends findPasswordDto {
  @IsPassword()
  password: string = "";
}

export class addUserDto extends loginDto {
  @IsNickname()
  nickname: string = "";
}
