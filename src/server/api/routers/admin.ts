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
          //Setting the algorithm we use
          .setProtectedHeader({ alg: "HS256" })
          // Setting JWT Token Id. We are using nanoid
          .setJti(nanoid())
          .setExpirationTime("1h")
          // We are signing the JWT key with JWT Secret key
          .sign(new TextEncoder().encode(getJwtSecretKey()));

        // Now we can send the above token to the client.
        // We are using a package named cookie to send the client token.
        // Serialize a cookie name-value pair into a Set-Cookie header string.
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
