import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AutenticacionService } from '../autenticacion.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private autenticacionService: AutenticacionService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'mi-secreto-super-seguro',
        });
    }

    async validate(payload: any) {
        const usuario = await this.autenticacionService.validarUsuario(payload.id);
        
        if (!usuario) {
            throw new UnauthorizedException('Token inválido');
        }

        return {
            id: payload.id,
            usuario: payload.usuario,
            rol: payload.rol,
        };
    }
}
