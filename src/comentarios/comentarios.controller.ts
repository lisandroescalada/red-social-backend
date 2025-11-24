import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';
import { CrearComentarioDto, EditarComentarioDto } from './dto/comentario.dto';

@Controller('comentarios')
@UseGuards(JwtAuthGuard)
export class ComentariosController {
    constructor(private comentariosService: ComentariosService) {}

    @Post('publicacion/:publicacionId')
    async crear(
        @Param('publicacionId') publicacionId: string,
        @Request() req,
        @Body() crearComentarioDto: CrearComentarioDto,
    ) {
        return this.comentariosService.crear(
            publicacionId,
            req.user.id,
            crearComentarioDto.contenido,
        );
    }

    @Get('publicacion/:publicacionId')
    async listar(
        @Param('publicacionId') publicacionId: string,
        @Query('limite') limite?: string,
        @Query('offset') offset?: string,
    ) {
        const limiteNum = limite ? parseInt(limite, 10) : 10;
        const offsetNum = offset ? parseInt(offset, 10) : 0;

        return this.comentariosService.listar(publicacionId, limiteNum, offsetNum);
    }

    @Put(':id')
    async editar(
        @Param('id') id: string,
        @Request() req,
        @Body() editarComentarioDto: EditarComentarioDto,
    ) {
        return this.comentariosService.editar(
            id,
            req.user.id,
            editarComentarioDto.contenido,
        );
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string, @Request() req) {
        return this.comentariosService.eliminar(id, req.user.id, req.user.rol);
    }
}
