import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL tidak ditemukan');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: 'teststaff@medstaff.com',
    },
  });

  if (!user) {
    throw new Error('User teststaff@medstaff.com tidak ditemukan');
  }

  const existing =
    await prisma.employeeProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

  if (existing) {
    console.log('Employee Profile sudah ada:', existing.id);
    return;
  }

  const employee =
    await prisma.employeeProfile.create({
      data: {
        userId: user.id,
        employeeId: 'TEST001',
        fullName: 'Test Staff',
        phone: '081234567890',
        birthPlace: 'Semarang',
        birthDate: new Date('2000-01-01'),
        gender: 'L',
        identityNumber: 'TEST001',
        address: 'Semarang',
        companyName: 'Klinik Pratama Unimus',
        position: 'Staff',
      },
    });

  console.log('Employee Profile berhasil dibuat');
  console.log('ID:', employee.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });