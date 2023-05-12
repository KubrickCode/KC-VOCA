import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";

export class renameFolderDto {
  @IsString({ message: "폴더명 형식을 확인하세요" })
  @Length(1, 20, { message: "폴더명은 1자 이상 20자이하로 입력하세요" })
  @IsNotEmpty({ message: "폴더명을 입력하세요" })
  name: string = "";
}

export class createFolderDto extends renameFolderDto {
  @IsInt({ message: "유효하지 않은 요청입니다" })
  @IsNotEmpty({ message: "유효하지 않은 요청입니다" })
  parent_id: number = 0;
}
