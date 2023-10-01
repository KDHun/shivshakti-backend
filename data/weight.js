const AWS = require("aws-sdk");
const config = process.env;
const { v1: uuidv1 } = require("uuid");

const getVehicalInfo = async () => {
  AWS.config.update({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: config.AWS_TABLE_NAME,
  };

  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const { Items } = data;
        resolve(Items);
      }
    });
  });
};

const addVehicalInfo = async (data) => {
  AWS.config.update({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  const Item = { ...data };
  Item.id = uuidv1();
  var params = {
    TableName: config.AWS_TABLE_NAME,
    Item: Item,
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(Item);
      }
    });
  });
};

const deleteAllVehicalData = async () => {
  AWS.config.update({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });

  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const scanParams = {
    TableName: config.AWS_TABLE_NAME,
  };

  try {
    const scanResult = await dynamodb.scan(scanParams).promise();

    if (scanResult.Items.length === 0) {
      return;
    }

    // Delete each item
    const deletePromises = scanResult.Items.map((item) => {
      const deleteParams = {
        TableName: config.AWS_TABLE_NAME,
        Key: {
          id: item.id, 
        },
      };
      return dynamodb.delete(deleteParams).promise(); 
    });

    await Promise.all(deletePromises);
  } catch (error) {}
};

const deleteVehicalData = async (id) => {
  AWS.config.update({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });

  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const deleteParams = {
      TableName: config.AWS_TABLE_NAME,
      Key: {
        id: id, 
      },
    };
    await dynamodb.delete(deleteParams).promise(); 
  } catch (error) {}
};

module.exports = {
  getVehicalInfo,
  addVehicalInfo,
  deleteVehicalData,
  deleteAllVehicalData,
};
