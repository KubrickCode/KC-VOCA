"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFolderService = exports.deleteFolderService = exports.renameFolderService = exports.createFolderService = exports.getFoldersService = void 0;
const Folder_1 = __importDefault(require("../models/queries/Folder"));
const getFoldersService = async (id) => {
    return await Folder_1.default.getFolders(id);
};
exports.getFoldersService = getFoldersService;
const createFolderService = async (id, parent_id, name) => {
    await Folder_1.default.createFolder(id, parent_id, name);
};
exports.createFolderService = createFolderService;
const renameFolderService = async (id, name) => {
    await Folder_1.default.renameFolder(id, name);
};
exports.renameFolderService = renameFolderService;
const deleteFolderService = async (id) => {
    await Folder_1.default.deleteFolder(id);
};
exports.deleteFolderService = deleteFolderService;
const moveFolderService = async (id, parent_id) => {
    if (id === parent_id) {
        return false;
    }
    else {
        const result = await Folder_1.default.moveFolder(id, parent_id);
        if (!result) {
            return false;
        }
        else {
            return true;
        }
    }
};
exports.moveFolderService = moveFolderService;
