import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ConvertAudio } from './conversion';
@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService,
  ) {
    // Initialize Cloudinary configuration
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // If you want to support AWS S3 as well, uncomment the following lines and configure them
  // private readonly s3Client = new S3Client({
  //   region: this.configService.getOrThrow('AWS_S3_REGION'),
  //   credentials: {
  //     accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
  //     secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
  //   },
  // });

  // Example for uploading files to AWS S3 (if needed in future)
  /*
  async uploadToS3(fileName: string, file: Buffer): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const uniqueFileName = `${Date.now()}${fileExtension}`;

    // Upload to S3 bucket
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: file,
      }),
    );

    // Return S3 URL for access
    return `https://${bucketName}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${uniqueFileName}`;
  }
  */

  /**
   * Uploads a file to Cloudinary.
   * @param file The file to upload (Multer file object).
   * @returns The URL of the uploaded file.
   */
  async upload(fileOrUrl: string | Express.Multer.File): Promise<string> {
    // If the input is a file buffer (Multer file), upload it to Cloudinary
    if (fileOrUrl instanceof Object && 'buffer' in fileOrUrl) {
      const file = fileOrUrl as Express.Multer.File;
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'uploads', // Cloudinary folder
            resource_type: 'auto', // Automatically detect file type
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error(`Cloudinary upload error: ${error.message}`));
            } else {
              resolve(result.secure_url); // Return the URL of the uploaded file
            }
          }
        ).end(file.buffer); // Upload the file buffer to Cloudinary
      });
    }

    // If the input is a URL, upload the image from the URL
    if (typeof fileOrUrl === 'string') {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          fileOrUrl, // Use the URL to upload
          {
            folder: 'uploads',
            resource_type: 'auto',
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error(`Cloudinary upload error: ${error.message}`));
            } else {
              resolve(result.secure_url); // Return the URL of the uploaded image
            }
          }
        );
      });
    }
  }
}
