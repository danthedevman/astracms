const {S3Client,PutObjectCommand,GetObjectCommand} = require("@aws-sdk/client-s3");

class FileUtil {
    constructor() {
        this.BUCKET_URL = process.env.BUCKET_URL;
        this.BUCKET_API_KEY = process.env.BUCKET_API_KEY;
        this.BUCKET_SECRET_KEY = process.env.BUCKET_SECRET_KEY;
        this.CLIENT = new S3Client({
            region: "us-east-1",
            endpoint: this.BUCKET_URL,
            credentials: {
                accessKeyId: this.BUCKET_API_KEY,
                secretAccessKey: this.BUCKET_SECRET_KEY,
            },
        });
    }

   async upload(key,file) {
        const putObjectCommand = new PutObjectCommand({
            Bucket: "astracms",
            Key: key,
            Body: file.buffer,
            ContentType:file.mimetype
        });

        await this.CLIENT.send(putObjectCommand);
    }

    async get(key) {
        const input = {
          "Bucket": "astracms",
          "Key": key,
        }
        const command = new GetObjectCommand(input);
        const assetObj = await this.CLIENT.send(command);
        return assetObj;
    }
}

module.exports = FileUtil;
