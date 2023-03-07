import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AppDataSource from 'src/config/type-orm/typeorm.config-migrations';
import { ContactInfo, Person } from 'src/entities/person.entity';
import { DeleteResult, IsNull, Not, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PersonRepository {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
  ) {}

  async getAll(
    queryParams: Record<string, unknown>,
  ): Promise<Person[] | undefined> {
    const queryBuilder = this.personRepository.createQueryBuilder();
    const formatQuery = (property: string, value: unknown) => {
      if (value) {
        queryBuilder.andWhere(`${property} LIKE :${property}`, {
          [property]: `%${value}%`,
        });
      }
    };
    Object.entries(queryParams).forEach(([key, value]) =>
      formatQuery(key, value),
    );
    const persons = await queryBuilder.getMany();
    return persons;
  }

  async get(id: number): Promise<Person | undefined> {
    return this.personRepository.findOne({
      where: { id },
      relations: { contactInfo: true },
    });
  }

  async getByEmail(email: string): Promise<Person | undefined> {
    return this.personRepository.findOneBy({ email });
  }

  async create(data: Partial<Person>): Promise<Person> {
    const { email } = data;

    const softDeletedPerson = await this.personRepository.findOne({
      where: { email, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (softDeletedPerson) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.manager.delete(ContactInfo, {
        person: softDeletedPerson.id,
      });
      await this.personRepository.delete(softDeletedPerson.id);
    }

    const person = this.personRepository.create(data);
    return await this.personRepository.save(person);
  }

  async addContact(
    data: Partial<ContactInfo>,
    personId: number,
  ): Promise<ContactInfo> {
    const person = await this.personRepository.findOne({
      where: { id: personId },
    });
    if (person?.id) {
      const contact = this.contactInfoRepository.create(
        Object.assign({}, data, { person }),
      );
      return await this.contactInfoRepository.save(contact);
    } else {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }
  }

  async update(id: number, data: Partial<Person>): Promise<Person> {
    await this.personRepository.update(id, data);
    return await this.personRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<Person> {
    const deletingPerson = await this.personRepository.findOneBy({ id });

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.manager.softDelete(ContactInfo, { person: id });
    await this.personRepository.softDelete(id);
    return deletingPerson;
  }

  async deleteMany(persons: number[]): Promise<DeleteResult['affected']> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let deleteResult: DeleteResult;
    try {
      for (const id of persons) {
        await queryRunner.manager.softDelete(ContactInfo, { person: id });
      }
      deleteResult = await queryRunner.manager.softDelete(Person, persons);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return deleteResult.affected;
  }

  async restoreMany(persons: number[]): Promise<UpdateResult['affected']> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let updateResult;
    try {
      for (const id of persons) {
        await queryRunner.manager.restore(ContactInfo, { person: id });
      }
      updateResult = await queryRunner.manager.restore(Person, persons);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return updateResult.affected;
  }
}
