import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET') || 'mi-secreto-super-seguro',
            signOptions: { expiresIn: '15m' },
        }),
        }),
        MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    ],
    controllers: [AutenticacionController],
    providers: [AutenticacionService, JwtStrategy],
    exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AutenticacionModule {}
