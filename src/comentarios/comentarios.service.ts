import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comentario } from './schemas/comentario.schema';
import { Publicacion } from '../publicaciones/schemas/publicacion.schema';

@Injectable()
export class ComentariosService {
    constructor(
        @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
        @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    ) {}

    async crear(publicacionId: string, usuarioId: string, contenido: string) {
        // Verificar que la publicación existe
        const publicacion = await this.publicacionModel.findById(publicacionId);
        if (!publicacion || !publicacion.activo) {
            throw new NotFoundException('Publicación no encontrada');
        }

        const nuevoComentario = new this.comentarioModel({
            publicacion: new Types.ObjectId(publicacionId),
            usuario: new Types.ObjectId(usuarioId),
            contenido,
        });

        await nuevoComentario.save();
        
        return this.comentarioModel
            .findById(nuevoComentario._id)
            .populate('usuario', 'nombre apellido usuario imagen');
    }

    async listar(
        publicacionId: string,
        limite: number = 10,
        offset: number = 0,
    ) {
        // Verificar que la publicación existe
        const publicacion = await this.publicacionModel.findById(publicacionId);
        if (!publicacion || !publicacion.activo) {
            throw new NotFoundException('Publicación no encontrada');
        }

        const comentarios = await this.comentarioModel
            .find({ 
                publicacion: new Types.ObjectId(publicacionId), 
                activo: true 
            })
            .populate('usuario', 'nombre apellido usuario imagen')
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limite)
            .exec();

        const total = await this.comentarioModel.countDocuments({
            publicacion: new Types.ObjectId(publicacionId),
            activo: true,
        });

        return {
            comentarios,
            total,
            pagina: Math.floor(offset / limite) + 1,
            totalPaginas: Math.ceil(total / limite),
        };
    }

    async editar(comentarioId: string, usuarioId: string, contenido: string) {
        const comentario = await this.comentarioModel.findById(comentarioId);

        if (!comentario || !comentario.activo) {
            throw new NotFoundException('Comentario no encontrado');
        }

        // Solo el propietario puede editar
        if (comentario.usuario.toString() !== usuarioId) {
            throw new ForbiddenException('No tenés permiso para editar este comentario');
        }

        comentario.contenido = contenido;
        comentario.editado = true;
        await comentario.save();

        return this.comentarioModel
            .findById(comentario._id)
            .populate('usuario', 'nombre apellido usuario imagen');
    }

    async eliminar(comentarioId: string, usuarioId: string, rolUsuario: string) {
        const comentario = await this.comentarioModel.findById(comentarioId);

        if (!comentario || !comentario.activo) {
            throw new NotFoundException('Comentario no encontrado');
        }

        // Solo el propietario o admin pueden eliminar
        if (
            comentario.usuario.toString() !== usuarioId &&
            rolUsuario !== 'admin'
        ) {
            throw new ForbiddenException('No tenés permiso para eliminar este comentario');
        }

        comentario.activo = false;
        await comentario.save();

        return { mensaje: 'Comentario eliminado correctamente' };
    }
}
