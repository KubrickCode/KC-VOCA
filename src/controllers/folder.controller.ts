import { Request, Response } from "express";
import Folder from "../models/queries/Folder";
import { UserType } from "src/models/types";

export const getFolders = async (req: Request, res: Response) => {
  const folders = await Folder.getFolders(Number(req.user?.id));
  res.json({ folders });
};

export const createFolder = async (req: Request, res: Response) => {
  const { parent_id, name } = req.body;
  const { id } = req.user as UserType;
  const result = await Folder.createFolder(id, parent_id, name);
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

export const moveFolder = async (req: Request, res: Response) => {
  const { id, parent_id } = req.query;
  const result = await Folder.moveFolder(Number(id), Number(parent_id));
  res.json(result);
};
