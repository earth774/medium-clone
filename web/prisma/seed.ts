import { PrismaClient } from '../app/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.status.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Active' },
  })

  await prisma.status.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'Inactive' },
  })

  await prisma.status.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: 'Deleted' },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

