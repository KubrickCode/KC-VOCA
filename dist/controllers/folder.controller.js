"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFolder = exports.deleteFolder = exports.renameFolder = exports.createFolder = exports.getFolders = void 0;
const folder_service_1 = require("../services/folder.service");
const getFolders = async (req, res) => {
    const folders = await (0, folder_service_1.getFoldersService)(Number(req.user?.id));
    res.status(200).json({ folders });
};
exports.getFolders = getFolders;
const createFolder = async (req, res) => {
    const { parent_id, name } = req.body;
    const { id } = req.user;
    await (0, folder_service_1.createFolderService)(id, parent_id, name);
    res.status(204).send();
};
exports.createFolder = createFolder;
const renameFolder = async (req, res) => {
    await (0, folder_service_1.renameFolderService)(Number(req.params.id), req.body.name);
    res.status(204).send();
};
exports.renameFolder = renameFolder;
const deleteFolder = async (req, res) => {
    await (0, folder_service_1.deleteFolderService)(Number(req.params.id));
    res.status(204).send();
};
exports.deleteFolder = deleteFolder;
const moveFolder = async (req, res) => {
    const { id, parent_id } = req.query;
    const result = await (0, folder_service_1.moveFolderService)(Number(id), Number(parent_id));
    if (!result) {
        res.status(403).json({ message: "해당 위치로 이동할 수 없습니다" });
    }
    else {
        res.status(204).send();
    }
};
exports.moveFolder = moveFolder;
