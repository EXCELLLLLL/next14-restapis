import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (e: any) {
        return new NextResponse("Error in fetching users" + e.message, {
            status: 500,
        });
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(
            JSON.stringify({ message: "User is created", user: newUser }),
            { status: 200 }
        );
    } catch (e: any) {
        return new NextResponse("Error in creating user" + e.message, {
            status: 500,
        });
    }
};

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: "Invalid request" }), {
                status: 400,
            });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
                status: 400,
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the DB" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updatedUser }),
            { status: 200 }
        );
    } catch (e: any) {
        return new NextResponse("Error in updating user" + e.message, {
            status: 500,
        });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "ID not found" }),
                {
                    status: 400,
                }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid userId" }), { status: 400, }
            )
        }

        await connect();
        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the DB" }), { status: 400 }
            )
        }

        return new NextResponse(
            JSON.stringify({ message: "User is deleted", user: deletedUser }), { status: 200 }
        )

    } catch (e: any) {
        return new NextResponse(
            "Error in deleting user" + e.message, { status: 500 }
        )
    }
};
