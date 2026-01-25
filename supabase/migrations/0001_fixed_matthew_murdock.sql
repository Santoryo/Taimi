ALTER TABLE "specializations_pve" DROP CONSTRAINT "specializations_pve_character_id_unique";--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "elite" SET NOT NULL;