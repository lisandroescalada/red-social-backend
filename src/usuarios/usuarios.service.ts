import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    ) {}

    async obtenerPerfil(id: string) {
        const usuario = await this.usuarioModel
            .findById(id)
            .select('-password');

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    async actualizarPerfil(id: string, datos: any, imagen?: string) {
        const actualizacion: any = { ...datos };
        
        if (imagen) {
            actualizacion.imagen = imagen;
        }

        const usuario = await this.usuarioModel
            .findByIdAndUpdate(id, actualizacion, { new: true })
            .select('-password');

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    // Métodos Admin
    async listarTodos() {
        return this.usuarioModel
            .find()
            .select('-password')
            .sort({ createdAt: -1 });
    }

    async crear(datos: any, imagen?: string) {
        const { correo, usuario, password } = datos;

        // Verificar si ya existe
        const existente = await this.usuarioModel.findOne({
            $or: [{ correo }, { usuario }],
        });

        if (existente) {
            throw new ConflictException('El correo o usuario ya existe');
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = new this.usuarioModel({
            ...datos,
            password: passwordHash,
            imagen: imagen || null,
        });

        await nuevoUsuario.save();
        
        return this.usuarioModel
            .findById(nuevoUsuario._id)
            .select('-password');
    }

    async cambiarEstado(id: string, activo: boolean) {
        const usuario = await this.usuarioModel.findByIdAndUpdate(
            id,
            { activo },
            { new: true }
            ).select('-password');

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }

    async cambiarRol(id: string, rol: string) {
        if (!['usuario', 'admin'].includes(rol)) {
            throw new Error('Rol inválido');
        }

        const usuario = await this.usuarioModel.findByIdAndUpdate(
            id,
            { rol },
            { new: true }
            ).select('-password');

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return usuario;
    }
}
