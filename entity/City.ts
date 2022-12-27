import { Entity, BeforeInsert, Column } from "typeorm";

import Model from "./Model";

@Entity("cities")
export class City extends Model {
  @Column({ nullable: true })
  area!: string;

  @Column({ nullable: true })
  coordsLat!: string;
  
  @Column({ nullable: true })
  coordsLong!: string;

  @Column({ nullable: true })
  district!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  population!: string;

  @Column({ nullable: true })
  state!: string;
}
