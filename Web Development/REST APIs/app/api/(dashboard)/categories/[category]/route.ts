import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const PATCH = async (req: Request, context: { params: any }) => {
    const categoryId = context.params.category;
    try {
        const body = await req.json();
        const { title } = body;

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId"}),
                { status: 400 }
            )
        }

        await connect();

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        const category = await Category.findOne({ _id: categoryId, user: userId });

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not founnd" }),
                { status: 404 }
            )
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true},
        );

        return new NextResponse(
            JSON.stringify({ message: "Category is updated" , category: updatedCategory}),
            { status: 200 }
        )
    } catch (e: any) {
        return new NextResponse(
            "Error in updating user category" + e.message,
            { status: 500 }
        )
    }
}

export const DELETE = async (req: Request, context: { params: any }) => {
    const categoryId = context.params.category;
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId" }),
                { status: 400 }
            )
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing category" }),
                { status: 400}
            )
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        const category = await Category.findOne({ _id: categoryId, user: userId });

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found or not belong to the user" }),
                { status: 404 }
            )
        }

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        return new NextResponse(
            JSON.stringify({ message: "Category is deleted" }),
            { status: 200 }
        )

    } catch (e: any) {
        return new NextResponse(
            "Error in deleting user category" + e.message,
            { status: 500 }
        )
    }
}