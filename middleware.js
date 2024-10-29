export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/pages/hometasks",
    "/pages/team",
    "/create-team",
    "/pages/profile",
    "/pages/notification",
    "/pages/bug",
  ],
};
