import { Order } from "../types/admin";
import { PRODUCTS } from "./products";

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    date: "2024-03-15T10:30:00Z",
    status: "pending",
    total: 4820,
    items: [
      { ...PRODUCTS[0], quantity: 1 },
      { ...PRODUCTS[1], quantity: 1 },
    ],
    customer: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 101-1001",
    },
  },
  {
    id: "ORD-002",
    date: "2024-03-14T15:45:00Z",
    status: "processed",
    total: 1200,
    items: [{ ...PRODUCTS[2], quantity: 1 }],
    customer: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 202-2002",
    },
  },
  {
    id: "ORD-003",
    date: "2024-03-12T09:15:00Z",
    status: "shipped",
    total: 2100,
    items: [{ ...PRODUCTS[3], quantity: 1 }],
    customer: {
      firstName: "Robert",
      lastName: "Architect",
      email: "robert.a@design.com",
      phone: "+1 (555) 303-3003",
    },
  },
];
