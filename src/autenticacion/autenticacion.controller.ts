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
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto, LoginDto } from './dto/registro.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('autenticacion')
export class AutenticacionController {
    constructor(
        private autenticacionService: AutenticacionService,
        private cloudinaryService: CloudinaryService,
    ) {}

    @Post('registro')
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
    async registrar(
        @Body() registroDto: RegistroDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let imagenUrl: string | null = null;
        
        if (file) {
            imagenUrl = await this.cloudinaryService.subirImagen(file, 'usuarios');
        }
        
        return this.autenticacionService.registrar(registroDto, (imagenUrl ?? ''));
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
