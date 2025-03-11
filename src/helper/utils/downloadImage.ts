import axios from "axios";
import path from "path";
import * as fs from "fs"

export class DownloadImage {
    static cleanUpImage(imagePath: string) {
        throw new Error('Method not implemented.');
    }
    async downloadImage(imageUrl: string, imagePath: string) {
        const writer = fs.createWriteStream(imagePath);
        const response = await axios.get(imageUrl, { responseType: 'stream' });

        return new Promise<void>((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }

    // Helper method to clean up the images after processing
    async cleanUpImage(imagePath: string) {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete file after processing
        }
    }
}