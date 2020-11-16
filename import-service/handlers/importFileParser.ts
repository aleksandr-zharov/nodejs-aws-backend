import {S3Event} from 'aws-lambda';
import 'source-map-support/register';
import csvParser from 'csv-parser';
import AwsSdk from 'aws-sdk';

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;

export const handler = async (event: S3Event) => {
  try {
    console.log('importFileParser:', event);
    const s3 = new AwsSdk.S3({ region });

    for (const record of event.Records) {
      const filePath = record.s3.object.key;
      const destination = filePath.replace('uploaded', 'parsed');

      await new Promise((resolve, reject) => {
        s3.getObject({
          Bucket: bucketName,
          Key: filePath,
        })
        .createReadStream()
        .on('error', reject)
        .pipe(csvParser())
        .on('error', reject)
        .on('end', resolve);
      });

      await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${bucketName}/${filePath}`,
        Key: destination,
      }).promise();

      await s3.deleteObject({
        Bucket: bucketName,
        Key: filePath,
      }).promise();
    }
  } catch (err) {
    console.error(err);
  }
};
