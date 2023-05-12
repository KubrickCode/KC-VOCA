import Folder from "../models/queries/Folder";

export const getFoldersService = async (id: number) => {
  return await Folder.getFolders(id);
};

export const createFolderService = async (
  id: number,
  parent_id: number,
  name: string
) => {
  return await Folder.createFolder(id, parent_id, name);
};

export const renameFolderService = async (id: number, name: string) => {
  return await Folder.renameFolder(id, name);
};

export const deleteFolderService = async (id: number) => {
  return await Folder.deleteFolder(id);
};

export const moveFolderService = async (id: number, parent_id: number) => {
  if (id === parent_id) {
    return false;
  } else {
    const result = await Folder.moveFolder(id, parent_id);
    if (!result) {
      return false;
    } else {
      return true;
    }
  }
};
