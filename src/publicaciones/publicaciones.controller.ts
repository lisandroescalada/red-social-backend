import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicacionesService } from './publicaciones.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
    constructor(
        private publicacionesService: PublicacionesService,
        private cloudinaryService: CloudinaryService,
    ) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('imagen', {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new Error('Solo se permiten imágenes'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    async crear(
        @Request() req,
        @Body('contenido') contenido: string,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let imagenUrl: string | null = null;
        
        if (file) {
            imagenUrl = await this.cloudinaryService.subirImagen(file, 'publicaciones');
        }
        
        return this.publicacionesService.crear(req.user.id, contenido, (imagenUrl ?? ''));
    }

    @Get()
    async listar(
        @Query('limite') limite?: string,
        @Query('offset') offset?: string,
        @Query('orden') orden?: 'fecha' | 'likes',
    ) {
        const limiteNum = limite ? parseInt(limite, 10) : 10;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        const ordenPor = orden || 'fecha';

        return this.publicacionesService.listar(limiteNum, offsetNum, ordenPor);
    }

    @Get(':id')
    async obtenerPorId(@Param('id') id: string) {
        return this.publicacionesService.obtenerPorId(id);
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string, @Request() req) {
        return this.publicacionesService.eliminar(
            id,
            req.user.id,
            req.user.rol,
        );
    }

    @Post(':id/me-gusta')
    async toggleMeGusta(@Param('id') id: string, @Request() req) {
        return this.publicacionesService.toggleMeGusta(id, req.user.id);
    }

    @Get(':id/me-gusta')
    async verificarLike(@Param('id') id: string, @Request() req) {
        return this.publicacionesService.verificarLike(id, req.user.id);
    }
}
