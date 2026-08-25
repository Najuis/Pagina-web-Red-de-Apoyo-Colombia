import { PrismaClient } from '@prisma/client';
async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { email: 'admin@comunidad.local' } });
  console.log(JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}
main();