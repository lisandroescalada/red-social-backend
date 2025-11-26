import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb+srv://lisandroescalada06_db_user:AmFGlthBFaI34mKh@redsocial.5sqa8ou.mongodb.net/app_data?appName=Redsocial'),
    CloudinaryModule,
    AutenticacionModule,
    UsuariosModule,
    PublicacionesModule,
    ComentariosModule,
    EstadisticasModule,
  ],
})
export class AppModule {}
