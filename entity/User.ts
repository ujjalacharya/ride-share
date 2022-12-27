import { Entity, BeforeInsert, Column } from "typeorm";

import Model from "./Model";

@Entity("users")
export class User extends Model {
  @Column({nullable: true, unique: true})
  email!: string;

  @Column({nullable: true})
  password!: string;

  @Column({nullable: true})
  firstName!: string;
  
  @Column({nullable: true})
  lastName!: string;
  
  @Column({nullable: true})
  age!: string;
  
  @Column({nullable: true})
  userType!: string; //driver or customer

  @Column({default: 'available'})
  status!: string; //driver or customer
  
  @Column({nullable: true})
  currentLocation!: string

  @Column({nullable: true})
  currentLocationLong!: string
  
  @Column({nullable: true})
  currentLocationLat!: string
}
