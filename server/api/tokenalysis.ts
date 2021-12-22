// import dotenv from "dotenv";
// dotenv.config();
// Store some remote secrets in .env file

export default async (req, res) => {
  
  // Wait a second to simulate a some remote API or database call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { data: "To the moon" }
};