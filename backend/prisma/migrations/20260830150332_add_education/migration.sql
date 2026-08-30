-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "schoolOrigin" TEXT,
    "nisOrigin" TEXT,
    "yearEntry" INTEGER,
    "className" TEXT,
    "major" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Education_studentId_key" ON "Education"("studentId");

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
