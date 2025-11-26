import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from '../publicaciones/schemas/publicacion.schema';
import { Comentario } from '../comentarios/schemas/comentario.schema';
import { Usuario } from '../usuarios/schemas/usuario.schema';

@Injectable()
export class EstadisticasService {
    constructor(
        @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
        @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
        @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    ) {}

    async publicacionesPorUsuario(fechaInicio?: string, fechaFin?: string) {
        const match: any = { activo: true };
        
        if (fechaInicio && fechaFin) {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            // Agregar 1 día al final para incluir todo el día
            fin.setDate(fin.getDate() + 1);
            
            match.createdAt = {
                $gte: inicio,
                $lt: fin, // Menos que el día siguiente (incluye todo el día actual)
        };
        }

        const resultado = await this.publicacionModel.aggregate([
            { $match: match },
            {
                $group: {
                _id: '$usuario',
                cantidad: { $sum: 1 },
                },
            },
            {
                $lookup: {
                from: 'usuarios',
                localField: '_id',
                foreignField: '_id',
                as: 'usuario',
                },
            },
            { $unwind: '$usuario' },
            {
                $project: {
                _id: 0,
                usuario: '$usuario.usuario',
                nombre: {
                    $concat: ['$usuario.nombre', ' ', '$usuario.apellido'],
                },
                cantidad: 1,
                },
            },
            { $sort: { cantidad: -1 } },
        ]);

        return resultado;
    }

    async comentariosPorRango(fechaInicio: string, fechaFin: string) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        // Agregar 1 día al final para incluir todo el día
        fin.setDate(fin.getDate() + 1);
        
        const resultado = await this.comentarioModel.aggregate([
            {
                $match: {
                activo: true,
                createdAt: {
                    $gte: inicio,
                    $lt: fin, // Menos que el día siguiente
                },
                },
            },
            {
                $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                cantidad: { $sum: 1 },
                },
            },
            {
                $project: {
                _id: 0,
                fecha: '$_id',
                cantidad: 1,
                },
            },
            { $sort: { fecha: 1 } },
        ]);

        return resultado;
    }

    async comentariosPorPublicacion() {
        const resultado = await this.comentarioModel.aggregate([
            { $match: { activo: true } },
            {
                $group: {
                _id: '$publicacion',
                cantidad: { $sum: 1 },
                },
            },
            {
                $lookup: {
                from: 'publicacions',
                localField: '_id',
                foreignField: '_id',
                as: 'publicacion',
                },
            },
            { $unwind: '$publicacion' },
            {
                $lookup: {
                from: 'usuarios',
                localField: 'publicacion.usuario',
                foreignField: '_id',
                as: 'usuario',
                },
            },
            { $unwind: '$usuario' },
            {
                $project: {
                _id: 0,
                publicacionId: '$_id',
                contenido: { $substr: ['$publicacion.contenido', 0, 50] },
                usuario: '$usuario.usuario',
                cantidad: 1,
                },
            },
            { $sort: { cantidad: -1 } },
            { $limit: 10 },
        ]);

        return resultado;
    }

    async resumenGeneral() {
        const totalUsuarios = await this.usuarioModel.countDocuments({ activo: true });
        const totalPublicaciones = await this.publicacionModel.countDocuments({ activo: true });
        const totalComentarios = await this.comentarioModel.countDocuments({ activo: true });
        
        const likesResult = await this.publicacionModel.aggregate([
            { $match: { activo: true } },
            { $project: { likes: { $size: '$meGusta' } } },
            { $group: { _id: null, total: { $sum: '$likes' } } },
        ]);
        
        const totalLikes = likesResult.length > 0 ? likesResult[0].total : 0;

        return {
            totalUsuarios,
            totalPublicaciones,
            totalComentarios,
            totalLikes,
        };
    }
}
