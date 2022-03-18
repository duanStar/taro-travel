import { createPool } from "mysql2";
import chalk from "chalk";

const dbOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  connectionLimit: 5,
  database: "yuanfang",
};

const connection = createPool(dbOptions);

connection.on("connection", () => {
  console.log(chalk.greenBright("数据库连接成功"));
});

/**
 * 公共查询方法
 * @param {String} sql 查询sql
 * @returns 结果列表
 */
export const sqlQuery = (sql) => {
  return new Promise((resolve, reject) => {
    connection.execute(sql, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};

export default connection;
