import sharp from "sharp";
export class ResizeImage {

    calculateAspectRatio(aspectRatio: string, imageSize: string): [number, number] {
        const sizeMap = {
            '256x256': [256, 256],
            '512x512': [512, 512],
            '1024x1024': [1024, 1024],
            '1792x1024': [1792, 1024],
            '1024x1792': [1024, 1792],
        };

        let [baseWidth, baseHeight] = sizeMap[imageSize];

        if (!aspectRatio) {
            return [baseWidth, baseHeight];
        }

        // Split the aspect ratio into width and height
        const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);

        // Calculate new dimensions
        const aspectRatioValue = aspectWidth / aspectHeight;
        let targetWidth, targetHeight;

        // Adjust based on aspect ratio
        if (baseWidth / baseHeight > aspectRatioValue) {
            targetHeight = baseHeight;
            targetWidth = Math.floor(baseHeight * aspectRatioValue); // Scale width
        } else {
            targetWidth = baseWidth;
            targetHeight = Math.floor(baseWidth / aspectRatioValue); // Scale height
        }

        return [targetWidth, targetHeight];
    }

    async resizeImage(inputPath: string, width: number, height: number): Promise<string> {
        const resizedPath = inputPath.replace('downloaded_', 'resized_'); // Change file name

        await sharp(inputPath)
            .resize(width, height, { fit: 'cover' }) // Maintain aspect ratio
            .toFile(resizedPath);

        return resizedPath;
    }

}