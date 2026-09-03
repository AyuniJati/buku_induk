-- CreateTable
CREATE TABLE "Violation" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "violationType" TEXT NOT NULL,
    "level" TEXT,
    "points" INTEGER,
    "violationDate" TIMESTAMP(3) NOT NULL,
    "sanction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Violation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Violation_studentId_idx" ON "Violation"("studentId");

-- AddForeignKey
ALTER TABLE "Violation" ADD CONSTRAINT "Violation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
