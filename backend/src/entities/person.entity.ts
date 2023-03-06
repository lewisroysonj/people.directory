import { IContactInfo, IPerson } from 'src/interfaces/person.interface';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Person implements IPerson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => ContactInfo, (contactInfo) => contactInfo.person, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  contactInfo: Array<IContactInfo>;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: new Date() })
  @CreateDateColumn()
  createTime: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;
}

@Entity()
export class ContactInfo implements IContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Person, (person: Person) => person.contactInfo)
  person: Person;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: number;

  @Column()
  country: string;

  @Column({ type: 'bigint' })
  phone: number;

  @Column()
  email: string;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;
}
