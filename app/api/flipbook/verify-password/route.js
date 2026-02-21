import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { title_slug, password } = await req.json();

        if (!title_slug || !password) {
            return NextResponse.json({ error: 'Title slug and password are required' }, { status: 400 });
        }

        // Query the database to find the hashed password associated with the title_slug
        const [result] = await db.execute(
            'SELECT password FROM pdf WHERE title_slug = ?',
            [title_slug]
        );

        if (!result || result.length === 0) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const hashedPassword = result[0].password;

        console.log("title_slug:", title_slug);
        console.log("password:", password);
        console.log("hashedPassword:", hashedPassword);

        // Ensure both password and hashedPassword are valid before calling bcrypt.compare
        if (!hashedPassword) {
            return NextResponse.json({ error: "Password not found in database" }, { status: 500 });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, hashedPassword);

        console.log("Password match result:", isMatch);

        if (isMatch) {
            return NextResponse.json({
                message: "Password verified successfully!"
            }, { status: 201 });
        } else {
            return NextResponse.json({
                error: "Invalid password"
            }, { status: 401 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
