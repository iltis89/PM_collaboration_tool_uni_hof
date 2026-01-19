-- Manual Migration: Add order and type columns to Exam table
-- Run this SQL against your Vercel/Prisma database when connection is available

-- Step 1: Create ExamType enum if not exists
DO $$ BEGIN
    CREATE TYPE "ExamType" AS ENUM ('TOPIC_BLOCK', 'MAIN_EXAM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add order column (nullable first for existing data)
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "order" INTEGER;

-- Step 3: Add type column with default
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "type" "ExamType" DEFAULT 'TOPIC_BLOCK';

-- Step 4: Give existing exams a high order number (so new topic blocks come first)
UPDATE "Exam" SET "order" = 99 WHERE "order" IS NULL;

-- Step 5: Make order NOT NULL after setting values
ALTER TABLE "Exam" ALTER COLUMN "order" SET NOT NULL;

-- Step 6: Add unique constraint
DO $$ BEGIN
    ALTER TABLE "Exam" ADD CONSTRAINT "Exam_order_key" UNIQUE ("order");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Done! Now run: npx tsx prisma/seed-pm-grundlagen.ts
