import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
    ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
    constructor(
        private usuariosService: UsuariosService,
        private cloudinaryService: CloudinaryService,
    ) {}

    @Get('perfil')
    async obtenerPerfil(@Request() req) {
        return this.usuariosService.obtenerPerfil(req.user.id);
    }

    @Put('perfil')
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
    async actualizarPerfil(
        @Request() req,
        @Body() datos: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let imagenUrl: string | null = null;
        
        if (file) {
            imagenUrl = await this.cloudinaryService.subirImagen(file, 'usuarios');
        }
        
        return this.usuariosService.actualizarPerfil(req.user.id, datos, (imagenUrl ?? ''));
    }

    // Rutas Admin
    @Get()
    async listarTodos(@Request() req) {
        if (req.user.rol !== 'admin') {
            throw new ForbiddenException('Acceso solo para administradores');
        }
        return this.usuariosService.listarTodos();
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('imagen', {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new Error('Solo se permiten imágenes'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async crear(
        @Request() req,
        @Body() datos: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (req.user.rol !== 'admin') {
            throw new ForbiddenException('Acceso solo para administradores');
        }
        
        let imagenUrl: string | null = null;
        
        if (file) {
            imagenUrl = await this.cloudinaryService.subirImagen(file, 'usuarios');
        }
        
        return this.usuariosService.crear(datos, (imagenUrl ?? ''));
    }

    @Put(':id/estado')
    async cambiarEstado(
        @Request() req,
        @Param('id') id: string,
        @Body('activo') activo: boolean,
    ) {
        if (req.user.rol !== 'admin') {
            throw new ForbiddenException('Acceso solo para administradores');
        }
        return this.usuariosService.cambiarEstado(id, activo);
    }

    @Put(':id/rol')
    async cambiarRol(
        @Request() req,
        @Param('id') id: string,
        @Body('rol') rol: string,
    ) {
        if (req.user.rol !== 'admin') {
            throw new ForbiddenException('Acceso solo para administradores');
        }
        return this.usuariosService.cambiarRol(id, rol);
    }
}
