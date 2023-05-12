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
exports.findPasswordDto = exports.addUserDto = exports.loginDto = exports.IsNickname = exports.IsPassword = void 0;
const class_validator_1 = require("class-validator");
const IsPassword = () => {
    return (target, propertyName) => {
        (0, class_validator_1.IsNotEmpty)({ message: "비밀번호를 입력하세요" })(target, propertyName);
        (0, class_validator_1.Length)(6, 20, { message: "비밀번호는 6자이상 20자이하로 입력하세요" })(target, propertyName);
        (0, class_validator_1.Matches)(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/, { message: "비밀번호 형식을 확인하세요(영문+숫자+특수문자)" })(target, propertyName);
        (0, class_validator_1.IsString)({ message: "비밀번호 형식을 확인하세요" })(target, propertyName);
    };
};
exports.IsPassword = IsPassword;
const IsNickname = () => {
    return (target, propertyName) => {
        (0, class_validator_1.IsNotEmpty)({ message: "닉네임을 입력하세요" })(target, propertyName);
        (0, class_validator_1.Length)(2, 10, { message: "닉네임은 2자 이상 10자 이하로 입력하세요" })(target, propertyName);
        (0, class_validator_1.Matches)(/^[a-zA-Z0-9가-힣]{2,10}$/, {
            message: "닉네임 형식을 확인하세요(영문or한글or숫자)",
        });
        (0, class_validator_1.IsString)({ message: "닉네임 형식을 확인하세요" })(target, propertyName);
    };
};
exports.IsNickname = IsNickname;
class loginDto {
    email = "";
    password = "";
}
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "이메일 형식을 확인하세요" }),
    (0, class_validator_1.Length)(5, 255, { message: "이메일은 5자 이상 255자 이하로 입력하세요" }),
    (0, class_validator_1.IsNotEmpty)({ message: "이메일을 입력하세요" }),
    __metadata("design:type", String)
], loginDto.prototype, "email", void 0);
__decorate([
    (0, exports.IsPassword)(),
    __metadata("design:type", String)
], loginDto.prototype, "password", void 0);
exports.loginDto = loginDto;
class addUserDto extends loginDto {
    nickname = "";
}
__decorate([
    (0, exports.IsNickname)(),
    __metadata("design:type", String)
], addUserDto.prototype, "nickname", void 0);
exports.addUserDto = addUserDto;
class findPasswordDto {
    email = "";
}
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "이메일 형식을 확인하세요" }),
    (0, class_validator_1.Length)(5, 255, { message: "이메일은 5자 이상 255자 이하로 입력하세요" }),
    (0, class_validator_1.IsNotEmpty)({ message: "이메일을 입력하세요" }),
    __metadata("design:type", String)
], findPasswordDto.prototype, "email", void 0);
exports.findPasswordDto = findPasswordDto;
