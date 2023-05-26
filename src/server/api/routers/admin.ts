import { adminProcedure } from "./../trpc";
import cookie from "cookie";
import { getJwtSecretKey } from "./../../../lib/auth";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { s3 } from "~/lib/s3";
import { MAX_IMAGE_SIZE } from "~/constants/config";

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

  createPresignedUrl: adminProcedure
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ input }) => {
      const id = nanoid();
      // For example: image/jpeg
      const ex = input.fileType.split("/")[1];
      const key = `${id}.${ex}`;

      const { url, fields } = (await new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Bucket: "booking-restaurant.t3",
            Fields: { key },
            Expires: 60,
            Conditions: [
              ["content-length-range", 0, MAX_IMAGE_SIZE],
              ["starts-with", "$Content-Type", "image/"],
            ],
          },

          (err, data) => {
            if (err) return reject(err);
            resolve(data);
          }
        );
      })) as any as { url: string; fields: any };

      return { url, fields, key };
    }),
});
