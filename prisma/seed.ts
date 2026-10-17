import { PrismaClient, Role } from "./generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter }); 

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