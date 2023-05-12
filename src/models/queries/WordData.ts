import { RowDataPacket } from "mysql2";
import pool from "../DB";
import { WordDataType } from "../Entity.type";

class WordData {
  async createWordData(
    user_id: number,
    folder_id: number,
    words_id: number,
    word: string,
    meaning: string,
    example_sentence: string,
    example_sentence_meaning: string
  ) {
    const result = await pool.query(
      "INSERT INTO worddata (user_id, folder_id, words_id,word,meaning,example_sentence,example_sentence_meaning) VALUES (?, ?, ?,?,?,?,?)",
      [
        user_id,
        folder_id,
        words_id,
        word,
        meaning,
        example_sentence,
        example_sentence_meaning,
      ]
    );
    return result;
  }

  async getWordData(words_id: number) {
    const [userResult] = await pool.query<RowDataPacket[]>(
      "SELECT name FROM words WHERE id = ?",
      [words_id]
    );
    const [wordDataResult] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM worddata WHERE words_id = ?",
      [words_id]
    );

    const result = {
      name: userResult[0].name,
      user_id: userResult[0].user_id,
      wordData: wordDataResult,
    };

    return result;
  }

  async updateWordData(id: number, data: Partial<WordDataType>) {
    const query = `UPDATE worddata SET word = ?, meaning = ?, example_sentence = ? , example_sentence_meaning = ? WHERE id = ?`;
    const params = [
      data.word,
      data.meaning,
      data.example_sentence,
      data.example_sentence_meaning,
      id,
    ];

    const [result] = await pool.query(query, params);
    return result;
  }

  async deleteWordData(id: number) {
    const [result] = await pool.query("DELETE FROM worddata WHERE id = ?", [
      id,
    ]);

    return result;
  }

  async searchData(id: number, keyword: string) {
    const [result] = await pool.query(
      "SELECT * FROM worddata WHERE word REGEXP ? AND worddata.user_id=? OR meaning REGEXP ? AND worddata.user_id=?",
      [keyword, id, keyword, id]
    );
    return result;
  }

  async updateComplete(id: number, is_complete: number) {
    await pool.query("UPDATE worddata SET is_complete=? WHERE id=?", [
      is_complete === 0 ? 1 : 0,
      id,
    ]);
  }
}

export default new WordData();
