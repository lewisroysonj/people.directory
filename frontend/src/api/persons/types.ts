export default interface IPerson {
  id: number;
  fullName: string;
  email: string;
  age: number | null;
  gender: string | null;
  isActive: boolean;
  isVerified: boolean;
  createTime: Date;
  deletedAt: Date | null;
  contactInfo?: Array<IContactInfo>;
}

export interface IContactInfo {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  phone: string;
  email: string;
  deletedAt: Date | null;
}
