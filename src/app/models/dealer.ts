import { SafeResourceUrl } from '@angular/platform-browser';

export class Dealer {
  name: string;
  company: string;
  email: string;
  phones: number[];
  urlImage: string;

  static fromFirebase({ name, email, company, phones, urlImage }) {
    return new Dealer(name, company, email, phones, urlImage);
  }

  constructor(
    name: string,
    company: string,
    email: string,
    phones: number[],
    urlImage: string
  ) {
    this.name = name;
    this.company = company;
    this.email = email;
    this.phones = phones;
    this.urlImage = urlImage;
  }
}
