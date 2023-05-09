import pool from "../db";

interface WordDataUpdate {
  word: string;
  meaning: string;
  example_sentence: string;
  example_sentence_meaning: string;
}

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
      "INSERT INTO WordData (user_id, folder_id, words_id,word,meaning,example_sentence,example_sentence_meaning) VALUES (?, ?, ?,?,?,?,?)",
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

  async getWordData(file_id: number) {
    const [result] = await pool.query("SELECT * FROM Words WHERE file_id = ?", [
      file_id,
    ]);
    return result;
  }

  async updateWordData(id: number, data: WordDataUpdate) {
    const query = `UPDATE WordData SET word = ?, meaning = ?, example_sentence = ? , example_sentence_meaning = ? WHERE id = ?`;
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
    const [result] = await pool.query("DELETE FROM WordData WHERE id = ?", [
      id,
    ]);

    return result;
  }
}

export default new WordData();
