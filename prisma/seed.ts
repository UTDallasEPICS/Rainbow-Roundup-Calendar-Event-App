import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient(); 

async function main() {
  console.log('Start seeding...')

  const samUser = await prisma.user.findUnique({
    where: {
      email: 'samuel.ma@npts.tech'
    }
  })

  if (!samUser) {
    await prisma.user.create
      ({
        data: {
            email: 'samuel.ma@npts.tech',
            firstname: 'Samuel',
            lastname: 'Ma',
            role: Role.SUPER,
        }
      })
    } 

  const kimberlyUser = await prisma.user.findUnique({
    where: {
      email: 'kimberly@rrup.org'
    }
  })

  if (!kimberlyUser) {
    await prisma.user.create({
      data: {
        email: 'kimberly@rrup.org',
        firstname: 'Kimberly',
        lastname: 'Kantor',
        role: Role.SUPER,
      }
    })
  }

  const adityaUser = await prisma.user.findUnique({
    where: {
      email: 'aditya@npts.tech'
    }
  })

  if (!adityaUser) {
    await prisma.user.create({
      data: {
        email: 'aditya@npts.tech',
        firstname: 'Aditya',
        lastname: 'Shivapooja',
        role: Role.SUPER,
      }
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });