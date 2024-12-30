-- CreateTable
CREATE TABLE "QuestionOfTheDay" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionOfTheDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOfTheDay_date_key" ON "QuestionOfTheDay"("date");

-- AddForeignKey
ALTER TABLE "QuestionOfTheDay" ADD CONSTRAINT "QuestionOfTheDay_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
