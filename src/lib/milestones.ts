export type Milestone = {
  date: string; // YYYY-MM-DD
  label: string;
  category: "booking" | "documents" | "planning" | "packing" | "fun";
  icon: string; // Lucide icon name
};

export const MILESTONES: Milestone[] = [
  { date: "2026-03-01", label: "Check passport expiry", category: "documents", icon: "FileCheck" },
  { date: "2026-03-15", label: "Apply for ESTA/visa waiver", category: "documents", icon: "Shield" },
  { date: "2026-04-01", label: "Book NYC & Philly accommodation", category: "booking", icon: "Bed" },
  { date: "2026-04-15", label: "Book car rental", category: "booking", icon: "Car" },
  { date: "2026-05-01", label: "Buy match tickets", category: "booking", icon: "Ticket" },
  { date: "2026-05-01", label: "Get travel insurance", category: "documents", icon: "Shield" },
  { date: "2026-05-15", label: "Confirm Boston & DC hosts", category: "booking", icon: "Home" },
  { date: "2026-05-20", label: "Finalize route decision", category: "planning", icon: "MapPin" },
  { date: "2026-06-01", label: "Download FIFA+ app", category: "fun", icon: "Smartphone" },
  { date: "2026-06-08", label: "Pack bags", category: "packing", icon: "Backpack" },
  { date: "2026-06-10", label: "Print boarding passes", category: "documents", icon: "Printer" },
  { date: "2026-06-11", label: "FLY TO BOSTON!", category: "fun", icon: "Plane" },
];
