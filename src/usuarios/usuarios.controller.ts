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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
    constructor(private usuariosService: UsuariosService) {}

    @Get('perfil')
    async obtenerPerfil(@Request() req) {
        return this.usuariosService.obtenerPerfil(req.user.id);
    }

    @Put('perfil')
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: diskStorage({
                destination: './uploads/usuarios',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `usuario-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Solo se permiten imágenes'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async actualizarPerfil(
        @Request() req,
        @Body() datos: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const imagenPath = file ? `/uploads/usuarios/${file.filename}` : null;
        return this.usuariosService.actualizarPerfil(req.user.id, datos, (imagenPath ?? ''));
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
        storage: diskStorage({
            destination: './uploads/usuarios',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `usuario-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
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
        const imagenPath = file ? `/uploads/usuarios/${file.filename}` : null;
        return this.usuariosService.crear(datos, (imagenPath ?? ''));
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
