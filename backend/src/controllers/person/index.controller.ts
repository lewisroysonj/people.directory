import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ContactInfoDTO, PersonDTO, PersonUpdateDTO } from 'src/dto/person.dto';
import handleSuccessResponse from 'src/helper/response/handle-success';
import { LoggingInterceptor } from 'src/interceptors/logging/logging.interceptor';
import { PersonService } from 'src/services/person/person.service';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class PersonController {
  constructor(private personService: PersonService) {}

  // GET /people
  @Get()
  async getAll(
    @Query('fullName') fullName: string,
    @Query('email') email: string,
    @Query('id') id: number,
  ) {
    const queryParams = {
      fullName,
      email,
      id,
    };

    const people = await this.personService.getAll(queryParams);
    if (people.length) {
      return handleSuccessResponse(people, 'People retrieved successfully');
    } else {
      throw new HttpException('No People exist!', HttpStatus.BAD_REQUEST);
    }
  }

  // GET /people/{id}
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const person = await this.personService.get(id);
    if (person) {
      return handleSuccessResponse(person, 'Person retrieved successfully');
    } else {
      throw new HttpException('Person not found!', HttpStatus.NOT_FOUND);
    }
  }

  // POST /people
  @Post()
  async create(@Body() person: PersonDTO) {
    const newPerson = await this.personService.create(person);
    if (newPerson) {
      return handleSuccessResponse(newPerson, 'New Person added successfully');
    } else {
      throw new HttpException(
        'Failed to create new person!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // POST /people/{id}/contact
  @Post(':id/contact')
  async addContact(
    @Body() contact: ContactInfoDTO,
    @Param('id', ParseIntPipe) personId: number,
  ) {
    const newContact = await this.personService.addContact(contact, personId);
    if (newContact) {
      return handleSuccessResponse(
        newContact,
        'New Contact added successfully',
      );
    } else {
      throw new HttpException(
        'Failed to create new contact!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /people/restore
  @Put('restore')
  async restoreMany(@Query('persons') persons: string) {
    const restoredPeopleLength = await this.personService.restoreMany(persons);
    if (restoredPeopleLength > 0) {
      return handleSuccessResponse(
        restoredPeopleLength,
        'Multiple deleted people restored successfully',
      );
    } else {
      throw new HttpException(
        'Failed to restore multiple deleted people!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // PUT /people/{id}
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: PersonUpdateDTO,
  ) {
    if (!Object.keys(updateData).length)
      throw new HttpException(
        'Please specify the data to update!',
        HttpStatus.BAD_REQUEST,
      );

    const isPersonExist = (await this.personService.get(id))?.id;
    if (!isPersonExist) {
      throw new HttpException(`Person doesn't exist!`, HttpStatus.NOT_FOUND);
    }

    const updatedPerson = await this.personService.update(id, updateData);
    if (updatedPerson.id) {
      return handleSuccessResponse(
        updatedPerson,
        'Person updated successfully',
      );
    } else {
      throw new HttpException(
        'Failed to update the person!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /people
  @Delete()
  async deleteMany(@Query('persons') persons: string) {
    const deletedPeopleLength = await this.personService.deleteMany(persons);
    if (deletedPeopleLength > 0) {
      return handleSuccessResponse(
        deletedPeopleLength,
        'Multiple people deleted successfully',
      );
    } else {
      throw new HttpException(
        'Failed to delete multiple people!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /people/{id}
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const isPersonExist = (await this.personService.get(id))?.id;
    if (!isPersonExist) {
      throw new HttpException(`Person doesn't exist!`, HttpStatus.NOT_FOUND);
    }

    const deletedPerson = await this.personService.delete(id);
    if (deletedPerson?.id) {
      return handleSuccessResponse(
        deletedPerson,
        'Person deleted successfully',
      );
    } else {
      throw new HttpException(
        'Failed to delete the person!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
