import { IsString, IsEmail, MinLength, Matches, IsDateString, IsOptional } from 'class-validator';

export class RegistroDto {
    @IsString()
    @MinLength(2)
    nombre: string;

    @IsString()
    @MinLength(2)
    apellido: string;

    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(3)
    usuario: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
        message: 'La contraseña debe contener al menos una mayúscula y un número',
    })
    password: string;

    @IsDateString()
    fechaNacimiento: string;

    @IsOptional()
    @IsString()
    descripcion?: string;
}

export class LoginDto {
    @IsString()
    usuarioOCorreo: string;

    @IsString()
    password: string;
}
