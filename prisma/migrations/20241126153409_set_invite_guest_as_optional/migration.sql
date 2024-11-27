-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_guest_id_fkey";

-- AlterTable
ALTER TABLE "invites" ALTER COLUMN "guest_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
