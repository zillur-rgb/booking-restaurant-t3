import { adminProcedure } from "./../trpc";
import cookie from "cookie";
import { getJwtSecretKey } from "./../../../lib/auth";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { res } = ctx;
      const { email, password } = input;

      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = await new SignJWT({})
          .setProtectedHeader({ alg: "HS256" })
          .setJti(nanoid())
          .setExpirationTime("1h")
          .sign(new TextEncoder().encode(getJwtSecretKey()));

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("user-token", token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
          })
        );
        return {
          message: "success",
        };
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }),

  sensitiveInfo: adminProcedure.mutation(() => {
    console.log("Highly sensitive");
  }),
});
