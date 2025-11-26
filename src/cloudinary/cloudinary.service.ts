import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
            cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async subirImagen(
        file: Express.Multer.File,
        carpeta: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
            folder: `red-social/${carpeta}`,
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' }, // Máximo 1000x1000
                { quality: 'auto' }, // Calidad automática
                { fetch_format: 'auto' }, // Formato automático (webp si es posible)
            ],
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) resolve(result.secure_url);
            },
        );

        // Convertir buffer a stream y subir
        const streamifier = require('streamifier');
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async eliminarImagen(url: string): Promise<void> {
        try {
            // Extraer public_id de la URL
            const urlParts = url.split('/');
            const fileWithExtension = urlParts[urlParts.length - 1];
            const publicId = fileWithExtension.split('.')[0];
            const folder = urlParts.slice(-3, -1).join('/'); // red-social/carpeta

            await cloudinary.uploader.destroy(`${folder}/${publicId}`);
        } catch (error) {
            console.error('Error al eliminar imagen de Cloudinary:', error);
            // No lanzar error, continuar aunque falle
        }
    }
}
