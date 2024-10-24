import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required.' })
    name: string;
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;
    @IsString()
    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(8, {
        message: 'Password is too short. It should be at least 8 characters long.',
    })
    @MaxLength(20, {
        message: 'Password is too long. It should be at most 20 characters long.',
    })
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
        message:
            'Password too weak. It should contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    password: string;
    @IsNotEmpty({ message: 'User type is required.' })
    user_type_id: string;
    remember_token: string;
}
