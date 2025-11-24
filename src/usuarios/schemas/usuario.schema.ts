import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Usuario extends Document {
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    apellido: string;

    @Prop({ required: true, unique: true, lowercase: true })
    correo: string;

    @Prop({ required: true, unique: true })
    usuario: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fechaNacimiento: Date;

    @Prop()
    descripcion: string;

    @Prop()
    imagen: string;

    @Prop({ default: 'usuario', enum: ['usuario', 'admin'] })
    rol: string;

    @Prop({ default: true })
    activo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
