require("dotenv").config();
const mysql = require("mysql2");


const pool = mysql.createConnection(process.env.DATABASE_URL);


const createTableIfNotExists = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CREATE TABLE IF NOT EXISTS vehical_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticketNo VARCHAR(255),
        vehicalNo VARCHAR(255),
        supplier VARCHAR(255),
        recevier VARCHAR(255),
        material VARCHAR(255),
        challan VARCHAR(255),
        address VARCHAR(255),
        place VARCHAR(255),
        gross VARCHAR(255),
        charges VARCHAR(255),
        tare VARCHAR(255),
        date VARCHAR(255),
        time VARCHAR(255)
      )`,
      (err) => {
        if (err) {
          console.error("Failed to create table:", err.message);
          reject(err);
        } else {
          console.log("--vehical_info-- Table created successfully.");
          resolve();
        }
      }
    );
  });
};


const getVehicleInfo = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM vehical_info", (err, results) => {
      if (err) {
        console.error("Error retrieving vehicle information:", err.message);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


const addVehicleInfo = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO vehical_info (ticketNo, vehicalNo, supplier, recevier, material, challan, address, place, gross, charges, tare, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.ticketNo,
        data.vehicalNo,
        data.supplier,
        data.recevier,
        data.material,
        data.challan,
        data.address,
        data.place,
        data.gross,
        data.charges,
        data.tare,
        data.date,
        data.time,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding vehicle information:", err.message);
          reject(err);
        } else {
          
          pool.query(
            "SELECT * FROM vehical_info WHERE id = LAST_INSERT_ID()",
            (err, results) => {
              if (err) {
                console.error(
                  "Error retrieving inserted vehicle information:",
                  err.message
                );
                reject(err);
              } else {
                const insertedData = results[0];
                resolve(insertedData);
              }
            }
          );
        }
      }
    );
  });
};
// Function to delete all vehicle data
const deleteAllVehicleData = () => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM vehical_info", (err) => {
      if (err) {
        console.error("Error deleting all vehicle data:", err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Function to delete vehicle data by ID
const deleteVehicleData = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM vehical_info WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("Error deleting vehicle data by ID:", err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  createTableIfNotExists,
  getVehicleInfo,
  addVehicleInfo,
  deleteVehicleData,
  deleteAllVehicleData,
};
