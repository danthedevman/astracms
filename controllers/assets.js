const {S3Client,PutObjectCommand,GetObjectCommand} = require("@aws-sdk/client-s3");

const getAssets = async (req, res, next) => {

  const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: process.env.BUCKET_URL,
    credentials: {
      accessKeyId: process.env.BUCKET_API_KEY,
      secretAccessKey: process.env.BUCKET_SECRET_KEY
    }
  });

  // Example of putting an object
  const putObjectCommand = new PutObjectCommand({
    Bucket: 'astracms',
    Key:'1234.test_name',
    Body: JSON.stringify({name:"test"})
  });

  //s3Client.send(putObjectCommand);

  const input = {
    "Bucket": "astracms",
    "Key": "123.test_name",
  };
  const command = new GetObjectCommand(input);
  const assetObj = await s3Client.send(command);
  console.log(assetObj)

  res.render("./pages/assets", {
    title: "Assets",
    layout: "./layouts/base",
    path: "assets",
    navbar_actions: [{ name: "add_asset", order: 100 }]
  });
};

module.exports = {
  getAssets
};