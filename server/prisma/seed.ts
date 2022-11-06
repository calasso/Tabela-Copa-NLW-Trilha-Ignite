import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john_doe@gmail.com',
      avatarUrl: 'https://github.com/calasso.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.315Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-24T11:00:00.000Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'RS',

      guesses: {
        create: {
          firstTeamScore: 1,
          secondTeamScore: 2,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  });
}

main()
  .then(() => {
    console.log('Done!');

    process.exit(0);
  })
  .catch((e) => {
    console.error(e);

    process.exit(1);
  });
