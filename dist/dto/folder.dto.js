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
exports.createFolderDto = exports.renameFolderDto = void 0;
const class_validator_1 = require("class-validator");
class renameFolderDto {
    name = "";
}
__decorate([
    (0, class_validator_1.IsString)({ message: "폴더명 형식을 확인하세요" }),
    (0, class_validator_1.Length)(1, 20, { message: "폴더명은 1자 이상 20자이하로 입력하세요" }),
    (0, class_validator_1.IsNotEmpty)({ message: "폴더명을 입력하세요" }),
    __metadata("design:type", String)
], renameFolderDto.prototype, "name", void 0);
exports.renameFolderDto = renameFolderDto;
class createFolderDto extends renameFolderDto {
    parent_id = 0;
}
__decorate([
    (0, class_validator_1.IsInt)({ message: "유효하지 않은 요청입니다" }),
    (0, class_validator_1.IsNotEmpty)({ message: "유효하지 않은 요청입니다" }),
    __metadata("design:type", Number)
], createFolderDto.prototype, "parent_id", void 0);
exports.createFolderDto = createFolderDto;
