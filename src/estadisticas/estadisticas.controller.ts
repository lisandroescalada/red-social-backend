import {
    Controller,
    Get,
    Query,
    UseGuards,
    Request,
    ForbiddenException,
} from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard)
export class EstadisticasController {
    constructor(private estadisticasService: EstadisticasService) {}

    private verificarAdmin(req: any) {
        if (req.user.rol !== 'admin') {
            throw new ForbiddenException('Acceso solo para administradores');
        }
    }

    @Get('publicaciones-por-usuario')
    async publicacionesPorUsuario(
        @Request() req,
        @Query('fechaInicio') fechaInicio?: string,
        @Query('fechaFin') fechaFin?: string,
    ) {
        this.verificarAdmin(req);
        return this.estadisticasService.publicacionesPorUsuario(fechaInicio, fechaFin);
    }

    @Get('comentarios-por-rango')
    async comentariosPorRango(
        @Request() req,
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        this.verificarAdmin(req);
        return this.estadisticasService.comentariosPorRango(fechaInicio, fechaFin);
    }

    @Get('comentarios-por-publicacion')
    async comentariosPorPublicacion(@Request() req) {
        this.verificarAdmin(req);
        return this.estadisticasService.comentariosPorPublicacion();
    }

    @Get('resumen')
    async resumenGeneral(@Request() req) {
        this.verificarAdmin(req);
        return this.estadisticasService.resumenGeneral();
    }
}
