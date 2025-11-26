import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Global() // Hace que el servicio esté disponible en toda la app
@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
