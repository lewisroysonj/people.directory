export interface IPerson {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  age: number;
  gender: string;
  createTime: Date;
  contactInfo: Array<IContactInfo>;
}

export interface IContactInfo {
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  phone: number;
  email: string;
}
