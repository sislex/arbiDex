import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("servers_pkey", ["serverId"], { unique: true })
@Entity("servers", { schema: "public" })
export class Servers {
  @PrimaryGeneratedColumn({ type: "integer", name: "server_id" })
  serverId: number;

  @Column("character varying", { name: "ip", length: 45 })
  ip: string;

  @Column("character varying", { name: "port", length: 10 })
  port: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;
}
