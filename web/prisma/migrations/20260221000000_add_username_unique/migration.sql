-- AlterTable
ALTER TABLE "user" ADD COLUMN "username" TEXT;

-- Backfill existing rows: use "user_" + id to guarantee uniqueness
UPDATE "user" SET "username" = 'user_' || "id" WHERE "username" IS NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
