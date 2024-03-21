const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                {
                    name: "Programming",
                },
                {
                    name: "Mathematics",
                },
                {
                    name: "Science",
                },
                {
                    name: "Fitness",
                },
                {
                    name: "Accounting",
                },
                {
                    name: "Engineering",
                },
                {
                    name: "Filming",
                }
            ]
        });
        console.log("Successfully seeded database categories");
    } catch (error) {
        console.log("Error while seeding database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();
