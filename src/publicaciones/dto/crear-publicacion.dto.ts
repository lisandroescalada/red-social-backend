import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
    @IsString()
    @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
    @MaxLength(5000, { message: 'El contenido no puede superar los 5000 caracteres' })
    contenido: string;
}
