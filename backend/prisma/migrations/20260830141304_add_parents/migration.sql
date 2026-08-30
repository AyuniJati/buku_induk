-- CreateTable
CREATE TABLE "Parent" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "relation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nik" TEXT,
    "birthPlace" TEXT,
    "birthDate" TIMESTAMP(3),
    "education" TEXT,
    "occupation" TEXT,
    "income" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
