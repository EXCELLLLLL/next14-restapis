import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in DB" }),
                { status: 400 }
            );
        }

        const categories = await Category.find({
            user: new Types.ObjectId(userId),
        });

        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (e: any) {
        return new NextResponse(
            "Error in fetching categories" + e.message, 
            { status: 500 }
        )
    }
};

export const POST = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const { title } = await req.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found"}),
                { status: 404 }
            )
        }

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId),
        })

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({ message: "Category is created", category: newCategory}),
            { status: 200 }
        )
    } catch(e: any) {
        return new NextResponse(
            "Error in creating category" + e.message,
            { status: 500 }
        )
    }
}