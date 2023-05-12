"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompleteDto = exports.searchDto = exports.ttsServiceDto = exports.createWordDataDto = exports.updateWordDataDto = void 0;
const class_validator_1 = require("class-validator");
class updateWordDataDto {
    word = "";
    meaning = "";
    example_sentence = "";
    example_sentence_meaning = "";
}
__decorate([
    (0, class_validator_1.IsString)({ message: "단어 형식을 확인하세요" }),
    (0, class_validator_1.Length)(1, 100, { message: "단어는 1자 이상 100자 이하로 입력하세요" }),
    (0, class_validator_1.IsNotEmpty)({ message: "단어를 입력하세요" }),
    __metadata("design:type", String)
], updateWordDataDto.prototype, "word", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "단어 뜻 형식을 확인하세요" }),
    (0, class_validator_1.MaxLength)(100, { message: "단어 뜻은 100자 이하로 입력하세요" }),
    __metadata("design:type", String)
], updateWordDataDto.prototype, "meaning", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "예문 형식을 확인하세요" }),
    (0, class_validator_1.MaxLength)(1000, { message: "예문은 1000자 이하로 입력하세요" }),
    __metadata("design:type", String)
], updateWordDataDto.prototype, "example_sentence", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "예문 뜻 형식을 확인하세요" }),
    (0, class_validator_1.MaxLength)(1000, { message: "예문 뜻은 1000자 이하로 입력하세요" }),
    __metadata("design:type", String)
], updateWordDataDto.prototype, "example_sentence_meaning", void 0);
exports.updateWordDataDto = updateWordDataDto;
class createWordDataDto extends updateWordDataDto {
    user_id = 0;
    words_id = 0;
}
__decorate([
    (0, class_validator_1.IsInt)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.IsNotEmpty)({ message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Number)
], createWordDataDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.IsNotEmpty)({ message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Number)
], createWordDataDto.prototype, "words_id", void 0);
exports.createWordDataDto = createWordDataDto;
class ttsServiceDto {
    text = "";
}
__decorate([
    (0, class_validator_1.IsString)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ttsServiceDto.prototype, "text", void 0);
exports.ttsServiceDto = ttsServiceDto;
class searchDto {
    keyword = "";
}
__decorate([
    (0, class_validator_1.IsString)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], searchDto.prototype, "keyword", void 0);
exports.searchDto = searchDto;
class updateCompleteDto {
    id = 0;
    is_complete = 0;
}
__decorate([
    (0, class_validator_1.IsInt)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.IsNotEmpty)({ message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Number)
], updateCompleteDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.IsNotEmpty)({ message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Number)
], updateCompleteDto.prototype, "is_complete", void 0);
exports.updateCompleteDto = updateCompleteDto;
