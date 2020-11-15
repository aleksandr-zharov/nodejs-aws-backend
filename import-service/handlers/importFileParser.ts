import {S3Event} from 'aws-lambda';
import 'source-map-support/register';
import csvParser from 'csv-parser';
import AwsSdk from 'aws-sdk';

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const uploadedPrefix = process.env.S3_UPLOADED_PREFIX;
const parsedPrefix = process.env.S3_PARSED_PREFIX;

export const handler = async (event: S3Event) => {
  console.log('importFileParser:', event);

  const s3 = new AwsSdk.S3({ region });

  const parallelPromises = event.Records.map(async (record) => {
    const source = record.s3.object.key;
    const destination = parsedPrefix + source.slice(uploadedPrefix.length);

    await new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: bucketName,
        Key: source,
      })
      .createReadStream()
      // Capture S3 service errors separately.
      .on('error', error => {
        reject(error);
      })
      .pipe(csvParser())
      .on('error', error => {
        reject(error);
      })
      .on('end', () => {
        resolve();
      });
    });

    await s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${source}`,
      Key: destination,
    })
    .promise();

    await s3.deleteObject({
      Bucket: bucketName,
      Key: source,
    })
    .promise();
  });

  await Promise.all(parallelPromises);
};
