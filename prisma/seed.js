const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  console.log("Use the signup page at /signup to create test users.");
  console.log("Better-auth will handle proper password hashing automatically.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
