import { Request, Response } from "express";
import Folder from "../models/queries/Folder";

export const getFolders = async (req: Request, res: Response) => {
  const folders = await Folder.getFolders(Number(req.user?.id));
  res.json({ folders });
};

export const createFolder = async (req: Request, res: Response) => {
  const { user_id, parent_id, name } = req.body;
  const result = await Folder.createFolder(user_id, parent_id, name);
  res.json(result);
};

export const renameFolder = async (req: Request, res: Response) => {
  const result = await Folder.renameFolder(
    Number(req.params.id),
    req.body.name
  );
  res.json(result);
};

export const deleteFolder = async (req: Request, res: Response) => {
  const result = await Folder.deleteFolder(Number(req.params.id));
  res.json(result);
};
