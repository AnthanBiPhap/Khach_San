import { type NextRequest, NextResponse } from "next/server"

// Sample user data
const users = [
  { id: "1", name: "Nguyễn Văn A", email: "a@example.com" },
  { id: "2", name: "Trần Thị B", email: "b@example.com" },
  { id: "3", name: "Lê Văn C", email: "c@example.com" },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const newUser = {
      id: String(users.length + 1),
      name,
      email,
    }

    users.push(newUser)

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
