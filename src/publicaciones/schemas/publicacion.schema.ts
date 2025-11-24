import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Publicacion extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    usuario: Types.ObjectId;

    @Prop({ required: true })
    contenido: string;

    @Prop()
    imagen: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
    meGusta: Types.ObjectId[];

    @Prop({ default: true })
    activo: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
