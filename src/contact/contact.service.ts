import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { Resend } from 'resend';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { APP_CONFIG } from '../common/config';
import { getProfessionalEmailTemplate } from '../common/emailtemplate';

@Injectable()
export class ContactService {
  private resend: Resend;

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {
    this.resend = new Resend(APP_CONFIG.resendApiKey);
  }

  async sendEmail(createContactDto: CreateContactDto) {
    try {
      const dbRecord = await this.contactRepository.save(createContactDto);

      const emailData = await this.resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'aftab26645@gmail.com',
        subject: `Portfolio Message from ${createContactDto.senderEmail} - ${Date.now()}`,
        html: getProfessionalEmailTemplate({
          senderEmail: createContactDto.senderEmail,
          message: createContactDto.message,
          senderName: createContactDto.senderName,
        }),
      });

      if (emailData.error) {
        console.error('Resend Error:', emailData.error);
        return {
          success: false,
          message: `Email failed: ${emailData.error.message}`,
          data: dbRecord,
        };
      }

      return {
        success: true,
        message: 'Message sent and saved successfully!',
        data: dbRecord,
      };
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException({
        success: false,
        message: err.message || 'Something went wrong',
        error: err.name || 'InternalServerError',
      });
    }
  }

  findAll() {
    return this.contactRepository.find();
  }

  findOne(id: string) {
    return this.contactRepository.findOneBy({ id });
  }

  update(id: string, updateContactDto: UpdateContactDto) {
    return this.contactRepository.update(id, updateContactDto);
  }

  remove(id: string) {
    return this.contactRepository.delete(id);
  }
}