import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from 'src/controllers/person/index.controller';
import { ContactInfo, Person } from 'src/entities/person.entity';
import { PersonRepository } from 'src/repositories/person/person.repository';
import { PersonService } from 'src/services/person/person.service';
import { isPersonAlreadyExist } from 'src/validators/person/person-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Person, ContactInfo])],
  controllers: [PersonController],
  providers: [PersonService, PersonRepository, isPersonAlreadyExist],
})
export class PersonModule {}
