/*
  Warnings:

  - You are about to drop the column `owner_id` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `guests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "guests" DROP CONSTRAINT "guests_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "guests" DROP CONSTRAINT "guests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_guest_id_fkey";

-- DropIndex
DROP INDEX "guests_user_id_key";

-- DropIndex
DROP INDEX "guests_user_id_owner_id_idx";

-- AlterTable
ALTER TABLE "guests" DROP COLUMN "owner_id",
DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tags" TEXT[],
    "owner_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Guests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_name_key" ON "workspaces"("name");

-- CreateIndex
CREATE INDEX "workspaces_name_owner_id_idx" ON "workspaces"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "_Guests_AB_unique" ON "_Guests"("A", "B");

-- CreateIndex
CREATE INDEX "_Guests_B_index" ON "_Guests"("B");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Guests" ADD CONSTRAINT "_Guests_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Guests" ADD CONSTRAINT "_Guests_B_fkey" FOREIGN KEY ("B") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
