import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { name, email, password }: RequestBody = await req.json();

    // Validate request data
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Received data:", { name, email, password }); // Log data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Ensure newUser is a plain object
    const userResponse: UserResponse = JSON.parse(
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      })
    );

    return new Response(JSON.stringify(userResponse), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    // Cleanup Prisma resources
    await prisma.$disconnect();
  }
}
