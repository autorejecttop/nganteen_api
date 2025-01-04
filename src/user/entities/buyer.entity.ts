import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Buyer extends User {
  @Column()
  nim: string;
}
