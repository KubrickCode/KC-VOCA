"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDescendantFolder = exports.checkDuplicate = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("./config");
const db = promise_1.default.createPool(config_1.user);
const checkDuplicate = async (type, folder, name) => {
    const query = `SELECT ${type}_name from voca_${type} WHERE ${type === "folder" ? "parent_id" : "folder_id"}=? AND ${type}_name=?`;
    const target = [folder, name];
    const [result] = await db.query(query, target);
    return result;
};
exports.checkDuplicate = checkDuplicate;
const isDescendantFolder = async (childId, parentId) => {
    let currentParentId = parentId;
    while (currentParentId !== 0) {
        const [rows] = await db.query("SELECT parent_id FROM voca_folder WHERE folder_id=?", [currentParentId]);
        currentParentId = rows[0].parent_id;
        console.log(currentParentId);
        if (currentParentId == childId) {
            return true;
        }
    }
    return false;
};
exports.isDescendantFolder = isDescendantFolder;
