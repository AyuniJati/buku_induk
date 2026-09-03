-- CreateTable
CREATE TABLE "StudentDevelopment" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "academic" TEXT,
    "attitude" TEXT,
    "social" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDevelopment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentDevelopment_studentId_idx" ON "StudentDevelopment"("studentId");

-- AddForeignKey
ALTER TABLE "StudentDevelopment" ADD CONSTRAINT "StudentDevelopment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
