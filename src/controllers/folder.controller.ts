import { Request, Response } from "express";
import { UserType } from "../models/types";
import {
  createFolderService,
  deleteFolderService,
  getFoldersService,
  moveFolderService,
  renameFolderService,
} from "../services/folder.service";

export const getFolders = async (req: Request, res: Response) => {
  const folders = await getFoldersService(Number(req.user?.id));
  res.json({ folders });
};

export const createFolder = async (req: Request, res: Response) => {
  const { parent_id, name } = req.body;
  const { id } = req.user as UserType;
  const result = await createFolderService(id, parent_id, name);
  res.json(result);
};

export const renameFolder = async (req: Request, res: Response) => {
  const result = await renameFolderService(
    Number(req.params.id),
    req.body.name
  );
  res.json(result);
};

export const deleteFolder = async (req: Request, res: Response) => {
  const result = await deleteFolderService(Number(req.params.id));
  res.json(result);
};

export const moveFolder = async (req: Request, res: Response) => {
  const { id, parent_id } = req.query;
  const result = await moveFolderService(Number(id), Number(parent_id));
  if (!result) {
    res.status(403).json({ message: "해당 위치로 이동할 수 없습니다" });
  } else {
    res.json(true);
  }
};
