import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from "class-validator";

export class updateWordDataDto {
  @IsString({ message: "단어 형식을 확인하세요" })
  @Length(1, 100, { message: "단어는 1자 이상 100자 이하로 입력하세요" })
  @IsNotEmpty({ message: "단어를 입력하세요" })
  word: string = "";

  @IsString({ message: "단어 뜻 형식을 확인하세요" })
  @MaxLength(100, { message: "단어 뜻은 100자 이하로 입력하세요" })
  meaning: string = "";

  @IsString({ message: "예문 형식을 확인하세요" })
  @MaxLength(1000, { message: "예문은 1000자 이하로 입력하세요" })
  example_sentence: string = "";

  @IsString({ message: "예문 뜻 형식을 확인하세요" })
  @MaxLength(1000, { message: "예문 뜻은 1000자 이하로 입력하세요" })
  example_sentence_meaning: string = "";
}

export class createWordDataDto extends updateWordDataDto {
  @IsInt({ message: "유효하지 않은 요청입니다" })
  @IsNotEmpty({ message: "유효하지 않은 요청입니다" })
  user_id: number = 0;

  @IsInt({ message: "유효하지 않은 요청입니다" })
  @IsNotEmpty({ message: "유효하지 않은 요청입니다" })
  words_id: number = 0;
}

export class ttsServiceDto {
  @IsString({ message: "유효하지 않은 요청입니다" })
  @MaxLength(1000)
  text: string = "";
}

export class searchDto {
  @IsString({ message: "유효하지 않은 요청입니다" })
  @MaxLength(100)
  keyword: string = "";
}
