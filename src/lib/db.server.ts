// Firebase REST-backed server database utility
export interface User {
  id: string;
  email: string;
  passwordHash: string; // plain text for simple mock authentication in this app
  role: "admin" | "agent" | "customer";
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  walletBalance: number;
  status: "active" | "paused" | "suspended";
}

export interface DeliveryAgent {
  id: string;
  userId: string;
  name: string;
  phone: string;
  vehicleInfo: string;
  status: "active" | "inactive";
}

export interface Cattle {
  id: string;
  tagNumber: string;
  cattleType: "cow" | "buffalo";
  breed: string;
  dob: string;
  status: "milking" | "dry" | "pregnant" | "medical";
  avgDailyYield: number;
}

export interface MilkPricing {
  id: string;
  cattleType: "cow" | "buffalo";
  basePricePerLiter: number;
}

export interface MilkTracking {
  id: string;
  cattleId: string;
  date: string;
  shift: "morning" | "evening";
  yieldLiters: number;
  fatPercentage: number;
  snfPercentage: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  milkType: "cow" | "buffalo";
  quantityLiters: number;
  shift: "morning" | "evening" | "both";
  frequency: "daily" | "alternate" | "custom";
  customDays?: number[]; // 0 for Sunday, 1 for Monday, etc.
  startDate: string;
  endDate?: string;
  status: "active" | "paused" | "expired";
}

export interface Delivery {
  id: string;
  subscriptionId: string;
  agentId: string;
  deliveryDate: string;
  shift: "morning" | "evening";
  quantityDelivered: number;
  status: "pending" | "delivered" | "skipped" | "cancelled";
  skipReason?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number; // positive for credit/top-up, negative for debit/delivery cost
  type: "deposit" | "delivery_charge" | "refund" | "adjustment";
  description: string;
  referenceId?: string; // delivery id or payment reference
  createdAt: string;
}

export interface CustomerMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  updatedAt: string;
}

export interface DbSchema {
  users: User[];
  customers: Customer[];
  deliveryAgents: DeliveryAgent[];
  cattle: Cattle[];
  milkPricing: MilkPricing[];
  milkTracking: MilkTracking[];
  subscriptions: Subscription[];
  deliveries: Delivery[];
  transactions: Transaction[];
  messages: CustomerMessage[];
  notes: Note[];
}

// Initial Seed Data
const getInitialSeed = (): DbSchema => {
  const users: User[] = [
    { id: "u-admin", email: "admin@puredrop.com", passwordHash: "admin123", role: "admin" },
    { id: "u-agent1", email: "agent@puredrop.com", passwordHash: "agent123", role: "agent" },
    { id: "u-cust1", email: "anita@puredrop.com", passwordHash: "customer123", role: "customer" },
    { id: "u-cust2", email: "pastry@puredrop.com", passwordHash: "customer123", role: "customer" },
  ];

  const customers: Customer[] = [
    {
      id: "c-cust1",
      userId: "u-cust1",
      name: "Anita Sharma",
      phone: "+91 98765 43210",
      address: "B-402, Sunset Heights, Green Meadows, CA 90210",
      lat: 34.0736204,
      lng: -118.4003563,
      walletBalance: 2450.00,
      status: "active",
    },
    {
      id: "c-cust2",
      userId: "u-cust2",
      name: "Chef Elena Rodriguez",
      phone: "+91 99999 88888",
      address: "Hyatt Pastry Section, Suite 101, Pasture Lane, CA 90210",
      lat: 34.0782312,
      lng: -118.4048991,
      walletBalance: 12050.00,
      status: "active",
    },
  ];

  const deliveryAgents: DeliveryAgent[] = [
    {
      id: "a-agent1",
      userId: "u-agent1",
      name: "Ramesh Kumar",
      phone: "+91 91234 56789",
      vehicleInfo: "E-Loader Truck (Electric) - DL3C-1234",
      status: "active",
    },
  ];

  const cattle: Cattle[] = [
    { id: "cat-1", tagNumber: "PD-COW-001", cattleType: "cow", breed: "Holstein Friesian", dob: "2021-04-12", status: "milking", avgDailyYield: 24.5 },
    { id: "cat-2", tagNumber: "PD-COW-002", cattleType: "cow", breed: "Jersey", dob: "2022-01-18", status: "milking", avgDailyYield: 18.2 },
    { id: "cat-3", tagNumber: "PD-BUF-001", cattleType: "buffalo", breed: "Murrah", dob: "2020-08-05", status: "milking", avgDailyYield: 14.8 },
    { id: "cat-4", tagNumber: "PD-BUF-002", cattleType: "buffalo", breed: "Nili-Ravi", dob: "2021-11-22", status: "dry", avgDailyYield: 0.0 },
    { id: "cat-5", tagNumber: "PD-COW-003", cattleType: "cow", breed: "Gir", dob: "2023-02-10", status: "pregnant", avgDailyYield: 0.0 },
  ];

  const milkPricing: MilkPricing[] = [
    { id: "p-cow", cattleType: "cow", basePricePerLiter: 70.00 },
    { id: "p-buf", cattleType: "buffalo", basePricePerLiter: 90.00 },
  ];

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const milkTracking: MilkTracking[] = [
    { id: "mt-1", cattleId: "cat-1", date: yesterday, shift: "morning", yieldLiters: 12.5, fatPercentage: 3.8, snfPercentage: 8.5 },
    { id: "mt-2", cattleId: "cat-1", date: yesterday, shift: "evening", yieldLiters: 11.8, fatPercentage: 3.9, snfPercentage: 8.6 },
    { id: "mt-3", cattleId: "cat-2", date: yesterday, shift: "morning", yieldLiters: 9.0, fatPercentage: 4.8, snfPercentage: 9.1 },
    { id: "mt-4", cattleId: "cat-2", date: yesterday, shift: "evening", yieldLiters: 8.5, fatPercentage: 4.9, snfPercentage: 9.2 },
    { id: "mt-5", cattleId: "cat-3", date: yesterday, shift: "morning", yieldLiters: 7.2, fatPercentage: 6.8, snfPercentage: 9.8 },
    { id: "mt-6", cattleId: "cat-3", date: yesterday, shift: "evening", yieldLiters: 7.0, fatPercentage: 7.0, snfPercentage: 10.0 },
  ];

  const subscriptions: Subscription[] = [
    {
      id: "sub-1",
      customerId: "c-cust1",
      milkType: "cow",
      quantityLiters: 2.0,
      shift: "both", // 1L morning, 1L evening
      frequency: "daily",
      startDate: yesterday,
      status: "active",
    },
    {
      id: "sub-2",
      customerId: "c-cust2",
      milkType: "buffalo",
      quantityLiters: 10.0,
      shift: "morning",
      frequency: "daily",
      startDate: yesterday,
      status: "active",
    },
  ];

  const deliveries: Delivery[] = [
    // Yesterday's deliveries completed
    {
      id: "del-1-y-m",
      subscriptionId: "sub-1",
      agentId: "a-agent1",
      deliveryDate: yesterday,
      shift: "morning",
      quantityDelivered: 1.0,
      status: "delivered",
    },
    {
      id: "del-1-y-e",
      subscriptionId: "sub-1",
      agentId: "a-agent1",
      deliveryDate: yesterday,
      shift: "evening",
      quantityDelivered: 1.0,
      status: "delivered",
    },
    {
      id: "del-2-y-m",
      subscriptionId: "sub-2",
      agentId: "a-agent1",
      deliveryDate: yesterday,
      shift: "morning",
      quantityDelivered: 10.0,
      status: "delivered",
    },
    // Today's pending deliveries
    {
      id: "del-1-t-m",
      subscriptionId: "sub-1",
      agentId: "a-agent1",
      deliveryDate: today,
      shift: "morning",
      quantityDelivered: 1.0,
      status: "pending",
    },
    {
      id: "del-1-t-e",
      subscriptionId: "sub-1",
      agentId: "a-agent1",
      deliveryDate: today,
      shift: "evening",
      quantityDelivered: 1.0,
      status: "pending",
    },
    {
      id: "del-2-t-m",
      subscriptionId: "sub-2",
      agentId: "a-agent1",
      deliveryDate: today,
      shift: "morning",
      quantityDelivered: 10.0,
      status: "pending",
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "tx-1",
      customerId: "c-cust1",
      amount: 2500.00,
      type: "deposit",
      description: "Initial wallet recharge (Online GPay)",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "tx-2",
      customerId: "c-cust2",
      amount: 13000.00,
      type: "deposit",
      description: "Initial bank transfer deposit",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    // Yesterday's delivery deductions (1L cow = 70rs morning, 1L cow = 70rs evening for Anita)
    {
      id: "tx-3",
      customerId: "c-cust1",
      amount: -70.00,
      type: "delivery_charge",
      description: "Deduction for 1L Cow Milk (Morning Shift)",
      referenceId: "del-1-y-m",
      createdAt: yesterday + "T07:15:00.000Z",
    },
    {
      id: "tx-4",
      customerId: "c-cust1",
      amount: -70.00,
      type: "delivery_charge",
      description: "Deduction for 1L Cow Milk (Evening Shift)",
      referenceId: "del-1-y-e",
      createdAt: yesterday + "T18:30:00.000Z",
    },
    // Yesterday's delivery deduction (10L buffalo = 900rs morning for Elena)
    {
      id: "tx-5",
      customerId: "c-cust2",
      amount: -900.00,
      type: "delivery_charge",
      description: "Deduction for 10L Buffalo Milk (Morning Shift)",
      referenceId: "del-2-y-m",
      createdAt: yesterday + "T06:45:00.000Z",
    },
  ];

  const messages: CustomerMessage[] = [
    {
      id: "msg-1",
      name: "Rohan Khanna",
      email: "rohan@gmail.com",
      phone: "+91 98989 89898",
      message: "Hi, I would like to subscribe for 2 liters of buffalo milk from next Monday. Please share subscription details.",
      status: "unread",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "msg-2",
      name: "Grand Hyatt Procurement",
      email: "procurement.hyatt@hyatt.com",
      message: "Need to verify if your organic milk certifications are renewed for 2026. Please email updated copy of USDA organic cert.",
      status: "unread",
      createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
  ];

  const notes: Note[] = [
    {
      id: "note-1",
      content: "Daily Checklist:\n1. Verify cold chain storage matches < 4°C at delivery dispatch.\n2. Review Ramesh (agent) fuel reports for vehicle DL3C-1234.\n3. Add new Buffalo tags to system.",
      updatedAt: new Date().toISOString(),
    },
  ];

  return {
    users,
    customers,
    deliveryAgents,
    cattle,
    milkPricing,
    milkTracking,
    subscriptions,
    deliveries,
    transactions,
    messages,
    notes,
  };
};

const FIREBASE_DB_URL = "https://pure-drop-firebase-default-rtdb.firebaseio.com/";

// Database utility class
export class FileDatabase {
  private static async fetchRaw(): Promise<DbSchema> {
    try {
      const res = await fetch(`${FIREBASE_DB_URL}.json`);
      if (!res.ok) {
        throw new Error(`Firebase read error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      
      // If Firebase returns null, database is uninitialized — seed it!
      if (!data) {
        console.log("Firebase Realtime Database is empty. Seeding database nodes...");
        const seed = getInitialSeed();
        await this.writeRaw(seed);
        return seed;
      }
      
      // Fallbacks in case individual tables are deleted/missing
      return {
        users: data.users || [],
        customers: data.customers || [],
        deliveryAgents: data.deliveryAgents || [],
        cattle: data.cattle || [],
        milkPricing: data.milkPricing || [],
        milkTracking: data.milkTracking || [],
        subscriptions: data.subscriptions || [],
        deliveries: data.deliveries || [],
        transactions: data.transactions || [],
        messages: data.messages || [],
        notes: data.notes || [],
      };
    } catch (e) {
      console.error("Firebase read failure, fallback to local initial seed...", e);
      return getInitialSeed();
    }
  }

  private static async writeRaw(db: DbSchema): Promise<void> {
    const res = await fetch(`${FIREBASE_DB_URL}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(db),
    });
    if (!res.ok) {
      throw new Error(`Firebase write error: ${res.status} ${res.statusText}`);
    }
  }

  public static async get(): Promise<DbSchema> {
    return await this.fetchRaw();
  }

  public static async update(updater: (db: DbSchema) => void): Promise<DbSchema> {
    const db = await this.fetchRaw();
    updater(db);
    await this.writeRaw(db);
    return db;
  }
}
