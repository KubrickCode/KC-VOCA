import { IsIn, IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { WordsStatus } from "../services/words.service";

export class renameWordsDto {
  @IsString({ message: "단어장명 형식을 확인하세요" })
  @Length(1, 18, { message: "단어장명은 1자이상 18자이하로 입력하세요" })
  @IsNotEmpty({ message: "단어장명을 입력하세요" })
  name: string = "";
}

export class createWordsDto extends renameWordsDto {
  @IsInt({ message: "유효하지 않은 요청입니다" })
  @IsNotEmpty({ message: "유효하지 않은 요청입니다" })
  folder_id: number = 0;
}

export class changeStatusDto {
  @IsIn([0, 1, undefined], { message: "유효하지 않은 요청입니다" })
  is_favorite: WordsStatus;

  @IsIn([0, 1, undefined], { message: "유효하지 않은 요청입니다" })
  is_shared: WordsStatus;
}
