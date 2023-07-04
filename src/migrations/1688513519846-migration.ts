import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1688513519846 implements MigrationInterface {
    name = 'migration1688513519846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "not_found_word" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word" character varying NOT NULL, "occurrence" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_f0d59ec37c997f89f9a09292696" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "word" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word" character varying NOT NULL, "phonetic" character varying, "audio" character varying, "partOfSpeech" text array NOT NULL, "meaning" json NOT NULL, "occurrence" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_word_status_enum" AS ENUM('new', 'learned')`);
        await queryRunner.query(`CREATE TABLE "user_word" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."user_word_status_enum" NOT NULL DEFAULT 'new', "userId" uuid, "wordId" uuid, CONSTRAINT "PK_a48686e127cc64975c587776c5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "refreshTokenHash" character varying, "version" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_word" ADD CONSTRAINT "FK_2a726298786a7c5be83f4477712" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_word" ADD CONSTRAINT "FK_cc11d9d235ad028713e10e9192e" FOREIGN KEY ("wordId") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_word" DROP CONSTRAINT "FK_cc11d9d235ad028713e10e9192e"`);
        await queryRunner.query(`ALTER TABLE "user_word" DROP CONSTRAINT "FK_2a726298786a7c5be83f4477712"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_word"`);
        await queryRunner.query(`DROP TYPE "public"."user_word_status_enum"`);
        await queryRunner.query(`DROP TABLE "word"`);
        await queryRunner.query(`DROP TABLE "not_found_word"`);
    }

}
