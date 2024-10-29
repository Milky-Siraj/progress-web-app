// middleware.js or middleware.ts in the root directory
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/pages/hometasks/:id*",
    "/pages/team/:id*",
    "/create-team",
    "/pages/profile",
    "/pages/notification",
    "/pages/bug/:id*",
  ],
};
