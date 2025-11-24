import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { RegistroDto, LoginDto } from './dto/registro.dto';

@Injectable()
export class AutenticacionService {
    constructor(
        @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
        private jwtService: JwtService,
    ) {}

    async registrar(registroDto: RegistroDto, imagen?: string) {
        const { correo, usuario, password } = registroDto;

        // Verificar si ya existe el correo o usuario
        const existente = await this.usuarioModel.findOne({
            $or: [{ correo }, { usuario }],
        });

        if (existente) {
            throw new ConflictException('El correo o usuario ya existe');
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear usuario
        const nuevoUsuario = new this.usuarioModel({
            ...registroDto,
            password: passwordHash,
            imagen: imagen || null,
            rol: 'usuario',
        });

        await nuevoUsuario.save();

        // Generar token
        const payload = { 
            id: nuevoUsuario._id, 
            usuario: nuevoUsuario.usuario,
            rol: nuevoUsuario.rol 
        };
        const token = this.jwtService.sign(payload);

        return {
        token,
        usuario: {
            id: nuevoUsuario._id,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            correo: nuevoUsuario.correo,
            usuario: nuevoUsuario.usuario,
            imagen: nuevoUsuario.imagen,
            rol: nuevoUsuario.rol,
            descripcion: nuevoUsuario.descripcion,
            fechaNacimiento: nuevoUsuario.fechaNacimiento,
        },
        };
    }

    async login(loginDto: LoginDto) {
        const { usuarioOCorreo, password } = loginDto;

        // Buscar por usuario o correo
        const usuario = await this.usuarioModel.findOne({
            $or: [{ usuario: usuarioOCorreo }, { correo: usuarioOCorreo }],
            activo: true,
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verificar contraseña
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generar token
        const payload = { 
            id: usuario._id, 
            usuario: usuario.usuario,
            rol: usuario.rol 
        };
        const token = this.jwtService.sign(payload);

        return {
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                usuario: usuario.usuario,
                imagen: usuario.imagen,
                rol: usuario.rol,
                descripcion: usuario.descripcion,
                fechaNacimiento: usuario.fechaNacimiento,
            },
        };
    }

    async refrescarToken(usuarioId: string) {
        const usuario = await this.usuarioModel.findById(usuarioId);
        
        if (!usuario || !usuario.activo) {
            throw new UnauthorizedException('Usuario no encontrado o inactivo');
        }

        const payload = { 
            id: usuario._id, 
            usuario: usuario.usuario,
            rol: usuario.rol 
        };
        const token = this.jwtService.sign(payload);

        return { token };
    }

    async validarUsuario(id: string) {
        const usuario = await this.usuarioModel.findById(id).select('-password');
        return usuario;
    }
}
