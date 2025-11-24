import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CrearComentarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
    @MaxLength(1000, { message: 'El comentario no puede superar los 1000 caracteres' })
    contenido: string;
}

export class EditarComentarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
    @MaxLength(1000, { message: 'El comentario no puede superar los 1000 caracteres' })
    contenido: string;
}
