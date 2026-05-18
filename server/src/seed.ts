import { connectDatabase } from "./config/db.js";
import { Lead } from "./models/Lead.js";
import { User } from "./models/User.js";

const run = async (): Promise<void> => {
  await connectDatabase();
  await Promise.all([Lead.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "Admin"
  });

  const sales = await User.create({
    name: "Sales User",
    email: "sales@example.com",
    password: "password123",
    role: "Sales User"
  });

  await Lead.insertMany([
    { name: "Rahul Sharma", email: "rahul@example.com", status: "Qualified", source: "Instagram", owner: admin._id },
    { name: "Priya Mehta", email: "priya@example.com", status: "New", source: "Website", owner: sales._id },
    { name: "Ankit Verma", email: "ankit@example.com", status: "Contacted", source: "Referral", owner: sales._id }
  ]);

  console.log("Seeded users and leads");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
