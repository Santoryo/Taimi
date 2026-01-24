CREATE TABLE "skills_pve" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"heal" integer,
	"utilities" integer[3],
	"elite" integer,
	CONSTRAINT "skills_pve_character_id_unique" UNIQUE("character_id")
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"race" varchar(20) NOT NULL,
	"profession" varchar(100) NOT NULL,
	"elite" varchar(100),
	"gender" varchar(10) NOT NULL,
	"level" integer NOT NULL,
	"deaths" integer DEFAULT 0 NOT NULL,
	"age" integer DEFAULT 0 NOT NULL,
	"title" integer DEFAULT 0 NOT NULL,
	"accessed_order" integer NOT NULL,
	"created" timestamp NOT NULL,
	"updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "characters_name_unique" UNIQUE("name")
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
	"index" integer NOT NULL,
	"spec_id" integer,
	"traits" integer[],
	CONSTRAINT "specializations_pve_character_id_unique" UNIQUE("character_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"auth_uid" uuid,
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created" timestamp NOT NULL,
	"api_key" text,
	"twitch_id" integer,
	CONSTRAINT "users_auth_uid_unique" UNIQUE("auth_uid"),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_api_key_unique" UNIQUE("api_key"),
	CONSTRAINT "users_twitch_id_unique" UNIQUE("twitch_id")
);
--> statement-breakpoint
CREATE TABLE "professions_static" (
	"id" serial PRIMARY KEY NOT NULL,
	"elite_spec_id" integer,
	"name" varchar(20) NOT NULL,
	"profession" varchar(20) NOT NULL,
	"icon" text NOT NULL,
	CONSTRAINT "professions_static_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "skills_pve" ADD CONSTRAINT "skills_pve_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specializations_pve" ADD CONSTRAINT "specializations_pve_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "equipment_character_id_slot_index" ON "equipment" USING btree ("character_id","slot");--> statement-breakpoint
CREATE UNIQUE INDEX "specializations_pve_character_id_index_index" ON "specializations_pve" USING btree ("character_id","index");