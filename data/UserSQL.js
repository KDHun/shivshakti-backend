require("dotenv").config();
const mysql = require("mysql2");


const pool = mysql.createConnection(process.env.DATABASE_URL);


const createTableIfNotExists = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error("Failed to create table:", err.message);
          reject(err);
        } else {
          console.log("--user-- Table created successfully.");
          resolve();
        }
      }
    );
  });
};

const getUser = (username) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT id, username, `password` FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error("Error retrieving user:", err.message);
        reject(err);
      } else {
        resolve(results[0]); // Assuming we only want the first result
      }
    });
  });
};


const addUser = (user) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (username, `password`) VALUES (?, ?)",
      [user.UserName, user.Password],
      (err, result) => {
        if (err) {
          console.error("Error adding user:", err.message);
          reject(err);
        } else {
          pool.query(
            "SELECT * FROM users WHERE username = ?",
            [user.UserName],
            (err, userResult) => {
              if (err) {
                console.error("Error retrieving inserted user:", err.message);
                reject(err);
              } else {
                const insertedUser = userResult[0];
                resolve(insertedUser);
              }
            }
          );
        }
      }
    );
  });
};


module.exports = {
  createTableIfNotExists,
  getUser,
  addUser,
};
