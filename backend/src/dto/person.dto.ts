import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ContactInfo } from 'src/entities/person.entity';
import { isPersonAlreadyExist } from 'src/validators/person/person-exist.validator';

export class PersonDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Validate(isPersonAlreadyExist)
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minSymbols: 1, minNumbers: 1 })
  readonly password: string;

  @IsOptional()
  @IsNumber()
  readonly age: number;

  @IsOptional()
  @IsString()
  readonly gender: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoDTO)
  readonly contactInfo: Array<ContactInfo>;
}

export class PersonUpdateDTO {
  @IsOptional()
  readonly fullName: string;

  @IsOptional()
  @IsEmail()
  @Validate(isPersonAlreadyExist)
  readonly email: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isVerified: boolean;

  @IsOptional()
  @IsNumber()
  readonly age: number;

  @IsOptional()
  @IsString()
  readonly gender: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoDTO)
  readonly contactInfo: Array<ContactInfo>;
}

export class ContactInfoDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly state: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly zip: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly phone: number;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
