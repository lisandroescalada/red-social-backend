import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto, LoginDto } from './dto/registro.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(private autenticacionService: AutenticacionService) {}

    @Post('registro')
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
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    async registrar(
        @Body() registroDto: RegistroDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const imagenPath = file ? `/uploads/usuarios/${file.filename}` : null;
        return this.autenticacionService.registrar(registroDto, (imagenPath ?? ''));
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.autenticacionService.login(loginDto);
    }

    @Post('refrescar')
    @UseGuards(JwtAuthGuard)
    async refrescar(@Request() req) {
        return this.autenticacionService.refrescarToken(req.user.id);
    }

    @Post('autorizar')
    @UseGuards(JwtAuthGuard)
    async autorizar(@Request() req) {
        return { 
            valido: true, 
            usuario: req.user 
        };
    }
}
