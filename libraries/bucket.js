// import AWS from "aws-sdk"

// const s3Client = new AWS.Config({
//     s3BucketEndpoint:true,
//     accessKeyId: process.env.API_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//     endpoint:process.env.S3_ENDPOINT_URL,
//     region: process.env.REGION,
// })
import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = process.env.REGION; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT_URL,
  //   endpointProvider: process.env.S3_ENDPOINT_URL,
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.API_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});
export { s3Client };
