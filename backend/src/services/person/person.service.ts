import { Injectable } from '@nestjs/common';
import { Person } from 'src/entities/person.entity';
import * as bcrypt from 'bcrypt';
import { PersonRepository } from 'src/repositories/person/person.repository';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(private readonly personRepository: PersonRepository) {}

  async getAll(queryParams: Record<string, unknown>): Promise<Person[]> {
    return this.personRepository.getAll(queryParams);
  }

  async get(id: number): Promise<Person> {
    return this.personRepository.get(id);
  }

  async create(data: Partial<Person>): Promise<Person> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;
    const person = await this.personRepository.create(data);
    delete person.password;
    return person;
  }

  async update(id: number, data: Partial<Person>): Promise<Person> {
    const updatedPerson = await this.personRepository.update(id, data);
    delete updatedPerson.password;
    return updatedPerson;
  }

  async delete(id: number): Promise<Person> {
    const deletedPerson = await this.personRepository.delete(id);
    delete deletedPerson.password;
    return deletedPerson;
  }

  async deleteMany(persons: string): Promise<DeleteResult['affected']> {
    const formattedPersonsQuery = persons.split(',').map((id) => Number(id));
    return await this.personRepository.deleteMany(formattedPersonsQuery);
  }

  async restoreMany(persons: string): Promise<UpdateResult['affected']> {
    const formattedPersonsQuery = persons.split(',').map((id) => Number(id));
    return await this.personRepository.restoreMany(formattedPersonsQuery);
  }
}
