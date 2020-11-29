import {S3, SQS} from 'aws-sdk';
import {S3Event} from 'aws-lambda';
import {errorHandler, successHandler} from "../common/default";
import * as csv from 'csv-parser';

const bucketName = process.env.S3_BUCKET_NAME;

export const handler = async (event: S3Event) => {
  try {
    console.log('importFileParser:', event);
    const s3 = new S3({ region: process.env.S3_REGION });
    const queue = new SQS();

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
              console.log('importFileParser::parse:', JSON.stringify(data, null, 4));

              queue.sendMessage({
                MessageBody: JSON.stringify(data),
                QueueUrl: process.env.SQS_URL,
              }, (error, data) => {
                if (error) {
                  console.error('importFileParser::SQS::error:', error);
                } else {
                  console.log('importFileParser::SQS::success:', data);
                }
              });

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
