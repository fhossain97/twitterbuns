import { tweetSchema } from "../../../components/CreateTweetForm";
import { createTRPCRouter as router, protectedProcedure } from "../trpc";

export const tweetRouter = router({
  create: protectedProcedure.input(tweetSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    JSON.stringify(prisma);
    const { text } = input;

    const userId = session.user.id;

    console.log(typeof prisma);

    return prisma.tweet.create({
      data: {
        text,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),
});
