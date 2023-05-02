import { tweetSchema } from "../../../components/CreateTweetForm";
import { createTRPCRouter as router, protectedProcedure } from "../trpc";

export const tweetRouter = router({
  create: protectedProcedure.input(tweetSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { text } = input;
    const userId = session.user.id;
    const prismaTweetObject = {
      data: {
        text,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    };

    const tweetCreated = prisma.tweet.create(prismaTweetObject);
    console.log(tweetCreated);
  }),
});
