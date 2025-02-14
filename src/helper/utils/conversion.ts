import { Injectable } from "@nestjs/common";
import ffmpeg from 'fluent-ffmpeg';
@Injectable()
export class ConvertAudio {
    async convertAudio(file: Express.Multer.File): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const output = Buffer.from([]);
            ffmpeg(file.buffer)
                .format('mp3') // Convert to mp3 format
                .on('end', () => resolve(output))
                .on('error', (err) => reject(err))
                .pipe(output, { end: true });
        });
    }
}