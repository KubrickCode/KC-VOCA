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
exports.changeStatusDto = exports.createWordsDto = exports.renameWordsDto = void 0;
const class_validator_1 = require("class-validator");
class renameWordsDto {
    name = "";
}
__decorate([
    (0, class_validator_1.IsString)({ message: "단어장명 형식을 확인하세요" }),
    (0, class_validator_1.Length)(1, 18, { message: "단어장명은 1자이상 18자이하로 입력하세요" }),
    (0, class_validator_1.IsNotEmpty)({ message: "단어장명을 입력하세요" }),
    __metadata("design:type", String)
], renameWordsDto.prototype, "name", void 0);
exports.renameWordsDto = renameWordsDto;
class createWordsDto extends renameWordsDto {
    folder_id = 0;
}
__decorate([
    (0, class_validator_1.IsInt)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.IsNotEmpty)({ message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Number)
], createWordsDto.prototype, "folder_id", void 0);
exports.createWordsDto = createWordsDto;
class changeStatusDto {
    is_favorite;
    is_shared;
}
__decorate([
    (0, class_validator_1.IsIn)([0, 1, undefined], { message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Object)
], changeStatusDto.prototype, "is_favorite", void 0);
__decorate([
    (0, class_validator_1.IsIn)([0, 1, undefined], { message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Object)
], changeStatusDto.prototype, "is_shared", void 0);
exports.changeStatusDto = changeStatusDto;
