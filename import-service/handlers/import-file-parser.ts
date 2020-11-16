import {S3Event} from 'aws-lambda';
import csv from 'csv-parser';
import { S3 } from 'aws-sdk';
import {errorHandler, successHandler} from "../common/default";

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;

export const handler = async (event: S3Event) => {
  try {
    console.log('importFileParser:', event);
    const s3 = new S3({ region });

    for (const record of event.Records) {
      const filePath = record.s3.object.key;
      const destination = filePath.replace('uploaded', 'parsed');

      await new Promise((resolve, reject) => {
        const s3Stream = s3.getObject({
          Bucket: bucketName,
          Key: filePath,
        }).createReadStream();
        s3Stream
            .pipe(csv())
            .on('data', (data) => {
              console.log(JSON.stringify(data, null, 4));
            })
            .on('end', resolve)
            .on('error', reject);
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

    return successHandler({});
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};
