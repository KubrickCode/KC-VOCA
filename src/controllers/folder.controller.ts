import { Request, Response } from "express";
import { UserType } from "../models/Entity.type";
import {
  createFolderService,
  deleteFolderService,
  getFoldersService,
  moveFolderService,
  renameFolderService,
} from "../services/folder.service";

export const getFolders = async (req: Request, res: Response) => {
  const folders = await getFoldersService(Number(req.user?.id));
  res.status(200).json({ folders });
};

export const createFolder = async (req: Request, res: Response) => {
  const { parent_id, name } = req.body;
  const { id } = req.user as UserType;
  await createFolderService(id, parent_id, name);
  res.status(204).send();
};

export const renameFolder = async (req: Request, res: Response) => {
  await renameFolderService(Number(req.params.id), req.body.name);
  res.status(204).send();
};

export const deleteFolder = async (req: Request, res: Response) => {
  await deleteFolderService(Number(req.params.id));
  res.status(204).send();
};

export const moveFolder = async (req: Request, res: Response) => {
  const { id, parent_id } = req.query;
  const result = await moveFolderService(Number(id), Number(parent_id));
  if (!result) {
    res.status(403).json({ message: "해당 위치로 이동할 수 없습니다" });
  } else {
    res.status(204).send();
  }
};
