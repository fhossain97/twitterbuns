// import { faker } from "@faker-js/faker";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// const USERS_TO_CREATE = 5;
// const TWEETS_MIN = 1;
// const TWEETS_MAX = 10;

// async function run() {
//   const userData = Array(USERS_TO_CREATE)
//     .fill(null)
//     .map(() => {
//       return {
//         name: faker.internet.userName().toLowerCase(),
//         email: faker.internet.email().toLocaleLowerCase(),
//         image: faker.image.avatar(),
//       };
//     });

//   const createUsers = userData.map((user) =>
//     prisma.user.create({ data: user })
//   );

//   const users = await prisma.$transaction(createUsers);

//   const tweets = [];

//   for (let i = 0; i < users.length; i++) {
//     const amount = faker.datatype.number({ min: TWEETS_MIN, max: TWEETS_MAX });

//     for (let ii = 0; ii < amount; ii++) {
//       tweets.push({
//         text: faker.lorem.sentence(),
//         author: {
//           connect: {
//             id: users[ii]?.id,
//           },
//         },
//       });
//     }
//   }

//   const createTweets = tweets.map((tweet) =>
//     prisma.tweet.create({ data: tweet })
//   );

//   await prisma.$transaction(createTweets);

//   await prisma.$disconnect();
// }

// run();

async function seeds() {
  const mushu = await prisma.user.upsert({
    where: { email: "mushuh@gmail.com" },
    update: {},
    create: {
      email: "mushuh@gmail.com",
      name: "Mushu",
      Tweet: {
        create: {
          text: "Fluffy wuffy poochie woochie bunny",
        },
      },
    },
  });
  const meeshu = await prisma.user.upsert({
    where: { email: "meeshuh@gmail.com" },
    update: {},
    create: {
      email: "meeshuh@gmail.com",
      name: "Meeshu",
      Tweet: {
        create: {
          text: "angry wangry little football",
        },
      },
    },
  });
  console.log({ mushu, meeshu });
}

seeds()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
