"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const db = promise_1.default.createPool(require("./config").user);
const checkDuplicate = async (type, folder, name) => {
    const query = `SELECT ${type}_name from voca_${type} WHERE ${type === "folder" ? "parent_id" : "folder_id"}=? AND ${type}_name=?`;
    const target = [folder, name];
    const [result] = await db.query(query, target);
    return result;
};
exports.default = checkDuplicate;
