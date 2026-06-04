import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authenticateUser } from "../auth.server";
import { FileDatabase } from "../db.server";

// Login endpoint
export const login = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    try {
      const session = await authenticateUser(data.email, data.password);
      return { success: true, session };
    } catch (error: any) {
      return { success: false, error: error.message || "Authentication failed" };
    }
  });

// Contact form submission endpoint
export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional().or(z.literal("")),
      message: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    try {
      await FileDatabase.update((db) => {
        db.messages.push({
          id: `msg-${Date.now()}`,
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          message: data.message,
          status: "unread",
          createdAt: new Date().toISOString(),
        });
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Failed to submit message" };
    }
  });
