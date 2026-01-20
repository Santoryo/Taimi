ALTER TABLE "users" ADD COLUMN "auth_uid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_auth_uid_unique" UNIQUE("auth_uid");