import mysql from "mysql2/promise";
import { dbConfig } from "../shared/config";

const pool = mysql.createPool(dbConfig);

export default pool;
