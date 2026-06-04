import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FileDatabase, Delivery, Transaction } from "../db.server";

// Get agent profile and deliveries checklist
export const getAgentDashboardData = createServerFn({ method: "POST" })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const db = await FileDatabase.get();

    // Find agent profile
    const agent = db.deliveryAgents.find((a) => a.userId === data.userId);
    if (!agent) {
      throw new Error("Agent profile not found.");
    }

    const today = new Date().toISOString().split("T")[0];

    // Find today's deliveries for this agent
    const deliveries = db.deliveries.filter(
      (d) => d.agentId === agent.id && d.deliveryDate === today
    );

    // Enrich deliveries with customer profile and subscription details
    const checklist = deliveries.map((d) => {
      const sub = db.subscriptions.find((s) => s.id === d.subscriptionId);
      const customer = sub ? db.customers.find((c) => c.id === sub.customerId) : null;
      
      return {
        id: d.id,
        shift: d.shift,
        quantity: d.quantityDelivered,
        status: d.status,
        skipReason: d.skipReason,
        milkType: sub?.milkType || "cow",
        customer: customer
          ? {
              id: customer.id,
              name: customer.name,
              phone: customer.phone,
              address: customer.address,
              lat: customer.lat,
              lng: customer.lng,
              walletBalance: customer.walletBalance,
            }
          : null,
      };
    });

    // Earnings estimation/completed deliveries count
    const totalAssigned = checklist.length;
    const completedCount = checklist.filter((item) => item.status === "delivered").length;
    const skippedCount = checklist.filter((item) => item.status === "skipped" || item.status === "cancelled").length;
    const pendingCount = checklist.filter((item) => item.status === "pending").length;

    return {
      agent,
      checklist,
      summary: {
        totalAssigned,
        completedCount,
        skippedCount,
        pendingCount,
      },
    };
  });

// Update delivery status + wallet balance deduction
export const updateDeliveryStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      deliveryId: z.string(),
      status: z.enum(["pending", "delivered", "skipped", "cancelled"]),
      skipReason: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    await FileDatabase.update((db) => {
      const delivery = db.deliveries.find((d) => d.id === data.deliveryId);
      if (!delivery) throw new Error("Delivery record not found.");

      // If it is already marked, check if we need to undo previous deductions (to prevent double deductions)
      const wasDelivered = delivery.status === "delivered";
      const isDelivering = data.status === "delivered";

      // If status doesn't change, do nothing
      if (delivery.status === data.status) return;

      // Find subscription details
      const sub = db.subscriptions.find((s) => s.id === delivery.subscriptionId);
      if (!sub) throw new Error("Subscription details not found for this delivery.");

      // Find customer
      const customer = db.customers.find((c) => c.id === sub.customerId);
      if (!customer) throw new Error("Customer profile not found.");

      // Find pricing
      const pricing = db.milkPricing.find((p) => p.cattleType === sub.milkType);
      const pricePerLiter = pricing?.basePricePerLiter || 70.00;
      const totalCost = delivery.quantityDelivered * pricePerLiter;

      // Handle wallet deduction / refund logic
      if (isDelivering && !wasDelivered) {
        // Deduct from wallet
        customer.walletBalance = parseFloat((customer.walletBalance - totalCost).toFixed(2));

        // Create transaction ledger entry
        db.transactions.push({
          id: `tx-${Date.now()}`,
          customerId: customer.id,
          amount: -totalCost,
          type: "delivery_charge",
          description: `Deducted for ${delivery.quantityDelivered}L ${sub.milkType === "cow" ? "Cow" : "Buffalo"} Milk (${delivery.shift.charAt(0).toUpperCase() + delivery.shift.slice(1)} Shift)`,
          referenceId: delivery.id,
          createdAt: new Date().toISOString(),
        });
      } else if (!isDelivering && wasDelivered) {
        // Refund previous deduction
        customer.walletBalance = parseFloat((customer.walletBalance + totalCost).toFixed(2));

        // Create refund transaction log
        db.transactions.push({
          id: `tx-${Date.now()}`,
          customerId: customer.id,
          amount: totalCost,
          type: "refund",
          description: `Refunded previous charge for ${delivery.quantityDelivered}L ${sub.milkType === "cow" ? "Cow" : "Buffalo"} Milk (Delivery marked as ${data.status})`,
          referenceId: delivery.id,
          createdAt: new Date().toISOString(),
        });
      }

      // Update delivery record
      delivery.status = data.status;
      delivery.skipReason = data.skipReason || undefined;
    });

    return { success: true };
  });
