-- AlterTable: Change correct from Int to Int[] for multi-select support
ALTER TABLE "QuizQuestion" ALTER COLUMN "correct" TYPE INTEGER[] USING ARRAY["correct"];
