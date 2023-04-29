import { createTRPCRouter as router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const tweetRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string({
          required_error: "Text is required within Tweet",
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text } = input;

      const userId = session.user.id;

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
