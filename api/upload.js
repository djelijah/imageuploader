const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { file, fileName, fileType } = req.body;

      if (!file || !fileName || !fileType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: fileType,
        ACL: 'public-read', // Adjust according to your requirements
      };

      const data = await s3.upload(params).promise();

      return res.status(200).json({ url: data.Location });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Error uploading file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};
