const AWS = require("aws-sdk");
const { v1: uuidv1 } = require("uuid");

const config = process.env;

const getUser = async (userName) => {
  AWS.config.update({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.AWS_USER_TABLE,
    FilterExpression: "UserName = :userName",
    ExpressionAttributeValues: {
      ":userName": userName,
    },
  };
  try {
    const data = await docClient.scan(params).promise();
    const { Items } = data;
    if (Items.length > 0) {
      return Items[0]; 
    }
    return null; 
  } catch (err) {
    return null;
  }
};

const addUser = async (req) => {
  AWS.config.update({
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY,
    region: config.REGION,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();
  const Item = { ...req };
  Item.id = uuidv1();
  Item.createdAt = new Date().toISOString();

  const params = {
    TableName: config.AWS_USER_TABLE,
    Item: Item,
  };
  try {
    await docClient.put(params).promise();

    return Item;
  } catch (err) {
    return null;
  }
};

module.exports = {
  getUser,
  addUser,
};
