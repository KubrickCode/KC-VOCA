export interface UserType {
  id: number;
  email: string;
  nickname: string;
  password: string;
  registration_date: Date;
}

export interface FolderType {
  id: number;
  user_id: number;
  parent_id: number;
  name: string;
  created_at: Date;
}

export interface WordType {
  id: number;
  folder_id: number;
  user_id: number;
  name: string;
  is_favorite: boolean;
  is_shared: boolean;
  created_at: Date;
  last_seen_time: Date;
}

export interface WordDataType {
  id: number;
  user_id: number;
  folder_id: number;
  words_id: number;
  word: string;
  meaning: string;
  example_sentence: string;
  example_sentence_meaning: string;
  created_at: Date;
  is_complete: boolean;
}
