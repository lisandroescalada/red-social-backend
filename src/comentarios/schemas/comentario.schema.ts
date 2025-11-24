import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comentario extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
    publicacion: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    usuario: Types.ObjectId;

    @Prop({ required: true })
    contenido: string;

    @Prop({ default: false })
    editado: boolean;

    @Prop({ default: true })
    activo: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
