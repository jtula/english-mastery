import { defineDb, defineTable, column } from 'astro:db';

// https://astro.build/db/config

const Lesson = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    type: column.text(),
    content: column.json(),
    createdAt: column.date({ default: new Date() })
  }
});

export default defineDb({
  tables: { Lesson }
});
