import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { Publicacion, PublicacionSchema } from '../publicaciones/schemas/publicacion.schema';
import { Comentario, ComentarioSchema } from '../comentarios/schemas/comentario.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { AutenticacionModule } from '../autenticacion/autenticacion.module';

@Module({
    imports: [
        MongooseModule.forFeature([
        { name: Publicacion.name, schema: PublicacionSchema },
        { name: Comentario.name, schema: ComentarioSchema },
        { name: Usuario.name, schema: UsuarioSchema },
        ]),
        AutenticacionModule,
    ],
    controllers: [EstadisticasController],
    providers: [EstadisticasService],
})
export class EstadisticasModule {}
