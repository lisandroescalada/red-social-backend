import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publicacion } from './schemas/publicacion.schema';

@Injectable()
export class PublicacionesService {
    constructor(
        @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    ) {}

    async crear(usuarioId: string, contenido: string, imagen?: string) {
        const nuevaPublicacion = new this.publicacionModel({
            usuario: new Types.ObjectId(usuarioId),
            contenido,
            imagen,
        });

        await nuevaPublicacion.save();
        return this.publicacionModel
            .findById(nuevaPublicacion._id)
            .populate('usuario', 'nombre apellido usuario imagen');
    }

    async listar(
        limite: number = 10,
        offset: number = 0,
        ordenarPor: 'fecha' | 'likes' = 'fecha',
    ) {
        const query = this.publicacionModel
            .find({ activo: true })
            .populate('usuario', 'nombre apellido usuario imagen')
            .skip(offset)
            .limit(limite);

        if (ordenarPor === 'fecha') {
            query.sort({ createdAt: -1 });
        } else {
            query.sort({ meGusta: -1, createdAt: -1 });
        }

        const publicaciones = await query.exec();
        const total = await this.publicacionModel.countDocuments({ activo: true });

        return {
            publicaciones,
            total,
            pagina: Math.floor(offset / limite) + 1,
            totalPaginas: Math.ceil(total / limite),
        };
    }

    async obtenerPorId(id: string) {
        const publicacion = await this.publicacionModel
            .findById(id)
            .populate('usuario', 'nombre apellido usuario imagen');

        if (!publicacion || !publicacion.activo) {
            throw new NotFoundException('Publicación no encontrada');
        }

        return publicacion;
    }

    async eliminar(id: string, usuarioId: string, rolUsuario: string) {
        const publicacion = await this.publicacionModel.findById(id);

        if (!publicacion || !publicacion.activo) {
            throw new NotFoundException('Publicación no encontrada');
        }

        // Solo el propietario o admin pueden eliminar
        if (
            publicacion.usuario.toString() !== usuarioId &&
            rolUsuario !== 'admin'
        ) {
            throw new ForbiddenException('No tenés permiso para eliminar esta publicación');
        }

        publicacion.activo = false;
        await publicacion.save();

        return { mensaje: 'Publicación eliminada correctamente' };
    }

    async toggleMeGusta(publicacionId: string, usuarioId: string) {
        const publicacion = await this.publicacionModel.findById(publicacionId);

        if (!publicacion || !publicacion.activo) {
            throw new NotFoundException('Publicación no encontrada');
        }

        const usuarioObjectId = new Types.ObjectId(usuarioId);
        const index = publicacion.meGusta.findIndex(
            (id) => id.toString() === usuarioId,
        );

        if (index > -1) {
        // Ya dio like, entonces lo quitamos
            publicacion.meGusta.splice(index, 1);
        } else {
        // No dio like, lo agregamos
            publicacion.meGusta.push(usuarioObjectId);
        }

        await publicacion.save();

        return {
            meGusta: publicacion.meGusta.length,
            usuarioDioLike: index === -1,
        };
    }

    async verificarLike(publicacionId: string, usuarioId: string) {
        const publicacion = await this.publicacionModel.findById(publicacionId);

        if (!publicacion) {
            throw new NotFoundException('Publicación no encontrada');
        }

        const dioLike = publicacion.meGusta.some(
            (id) => id.toString() === usuarioId,
        );

        return {
            dioLike,
            totalLikes: publicacion.meGusta.length,
        };
    }
}
