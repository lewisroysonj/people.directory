import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PersonRepository } from 'src/repositories/person/person.repository';

@ValidatorConstraint({ name: 'isPersonAlreadyExist', async: true })
@Injectable()
export class isPersonAlreadyExist implements ValidatorConstraintInterface {
  constructor(private readonly personRepository: PersonRepository) {}

  async validate(email: string): Promise<boolean> {
    if (!email) {
      return true;
    }
    const person = await this.personRepository.getByEmail(email);
    return !person;
  }

  defaultMessage(): string {
    return 'The provided email $value is already registered, Please use other email';
  }
}
