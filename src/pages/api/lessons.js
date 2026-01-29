import { db, Lesson, eq } from "astro:db";

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, title, type, content } = body;

    if (!id || !title || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const existing = await db.select().from(Lesson).where(eq(Lesson.id, id));
    if (existing.length === 0) {
      await db.insert(Lesson).values({
        id,
        title,
        type,
        content: content || null,
        createdAt: new Date(),
      });
      return new Response(
        JSON.stringify({ success: true, message: "Lesson created" }),
        { status: 201 },
      );
    } else {
      if (content) {
        await db.update(Lesson).set({ content }).where(eq(Lesson.id, id));
        return new Response(
          JSON.stringify({ success: true, message: "Lesson updated" }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({ success: true, message: "Lesson already exists" }),
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("API lessons error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
