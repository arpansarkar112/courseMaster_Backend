const { z } = require("zod");

const createCourseSchema = z
  .object({
    title: z.string().trim().min(3, "Course title must be at least 3 characters"),
    description: z.string().trim().min(10, "Course description must be at least 10 characters"),
    instructorName: z.string().trim().min(2, "Instructor name must be at least 2 characters"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    category: z.string().trim().optional(),
    tags: z.array(z.string()).optional(),
    batches: z.array(z.any()).optional(),
    syllabus: z.array(z.any()).optional(),
  })
  .passthrough();

const updateCourseSchema = createCourseSchema.partial().passthrough();

module.exports = { createCourseSchema, updateCourseSchema };
