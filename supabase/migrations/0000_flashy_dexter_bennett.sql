CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"race" varchar(20) NOT NULL,
	"profession" varchar(100) NOT NULL,
	"gender" varchar(10) NOT NULL,
	"level" integer NOT NULL,
	"created" timestamp NOT NULL,
	"deaths" integer DEFAULT 0 NOT NULL,
	"age" integer DEFAULT 0 NOT NULL,
	"title" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"slot" varchar(100) NOT NULL,
	"skin_id" integer,
	"stats_id" integer,
	"binding" varchar(100),
	"dyes" integer[],
	"upgrades" integer[],
	"infusions" integer[]
);
--> statement-breakpoint
CREATE TABLE "specializations_pve" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"specialization_id" integer NOT NULL,
	"traits" integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created" timestamp NOT NULL,
	"api_key" text,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specializations_pve" ADD CONSTRAINT "specializations_pve_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;