export class Promotion {
  static fromFirebase({ id, name, description, price, available, image }) {
    return new Promotion(id, name, description, price, available, image);
  }

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public available: boolean,
    public image: string
  ) {}
}
