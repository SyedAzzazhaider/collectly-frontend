export const MOCK_CUSTOMERS = [
  { id: 1, name: "John Doe", company: "Doe Designs", email: "john@doedesigns.com", phone: "+1 (555) 123-4567", totalDue: 1500, status: "overdue", avatar: "" },
  { id: 2, name: "Jane Smith", company: "Smith Consulting", email: "jane@smithconsulting.com", phone: "+1 (555) 987-6543", totalDue: 750, status: "pending", avatar: "" },
  { id: 3, name: "Robert Johnson", company: "Johnson LLC", email: "robert@johnsonllc.com", phone: "+1 (555) 456-7890", totalDue: 0, status: "paid", avatar: "" },
  { id: 4, name: "Emily Davis", company: "Davis & Partners", email: "emily@davispartners.com", phone: "+1 (555) 321-0987", totalDue: 3200, status: "overdue", avatar: "" },
  { id: 5, name: "Michael Chen", company: "Chen Technologies", email: "michael@chentech.com", phone: "+1 (555) 654-3210", totalDue: 480, status: "pending", avatar: "" },
  { id: 6, name: "Sarah Wilson", company: "Wilson Media", email: "sarah@wilsonmedia.com", phone: "+1 (555) 789-0123", totalDue: 0, status: "paid", avatar: "" },
  { id: 7, name: "David Brown", company: "Brown Enterprises", email: "david@brownent.com", phone: "+1 (555) 234-5678", totalDue: 920, status: "pending", avatar: "" },
  { id: 8, name: "Lisa Anderson", company: "Anderson Group", email: "lisa@andersongrp.com", phone: "+1 (555) 876-5432", totalDue: 5600, status: "overdue", avatar: "" },
];

export const MOCK_INVOICES = [
  { id: 101, number: "INV-001", customerId: 1, customer: "John Doe", amount: 500, issueDate: "2024-02-01", dueDate: "2024-03-01", status: "overdue" },
  { id: 102, number: "INV-002", customerId: 2, customer: "Jane Smith", amount: 750, issueDate: "2024-02-15", dueDate: "2024-03-15", status: "pending" },
  { id: 103, number: "INV-003", customerId: 1, customer: "John Doe", amount: 1000, issueDate: "2024-01-15", dueDate: "2024-02-15", status: "paid" },
  { id: 104, number: "INV-004", customerId: 4, customer: "Emily Davis", amount: 3200, issueDate: "2024-01-20", dueDate: "2024-02-20", status: "overdue" },
  { id: 105, number: "INV-005", customerId: 5, customer: "Michael Chen", amount: 480, issueDate: "2024-02-28", dueDate: "2024-03-28", status: "pending" },
  { id: 106, number: "INV-006", customerId: 3, customer: "Robert Johnson", amount: 1250, issueDate: "2024-01-10", dueDate: "2024-02-10", status: "paid" },
  { id: 107, number: "INV-007", customerId: 8, customer: "Lisa Anderson", amount: 5600, issueDate: "2024-01-05", dueDate: "2024-02-05", status: "overdue" },
  { id: 108, number: "INV-008", customerId: 7, customer: "David Brown", amount: 920, issueDate: "2024-02-20", dueDate: "2024-03-20", status: "pending" },
];

export const MOCK_SEQUENCES = [
  { id: 1, name: "Standard Collection", phases: 5, lastEdited: "2024-02-20", status: "active", description: "Default 5-phase collection process" },
  { id: 2, name: "Friendly Reminder", phases: 3, lastEdited: "2024-02-18", status: "active", description: "Gentle 3-phase reminder for good customers" },
  { id: 3, name: "Legal Notice", phases: 4, lastEdited: "2024-02-15", status: "draft", description: "Escalated 4-phase process with legal steps" },
  { id: 4, name: "Quick Follow-up", phases: 2, lastEdited: "2024-02-10", status: "active", description: "Simple 2-step follow-up" },
];

export const MOCK_TEMPLATES = [
  { id: 1, name: "Friendly First Reminder", channel: "email", category: "Friendly", content: "Hi {{customer_name}}, just a quick reminder that invoice {{invoice_number}} for {{amount}} is due on {{due_date}}.", lastEdited: "2024-02-20" },
  { id: 2, name: "Payment Overdue Notice", channel: "email", category: "Standard", content: "Dear {{customer_name}}, your payment of {{amount}} for invoice {{invoice_number}} is now overdue.", lastEdited: "2024-02-18" },
  { id: 3, name: "SMS Quick Reminder", channel: "sms", category: "Friendly", content: "Hi {{customer_name}}, reminder: {{amount}} due {{due_date}} for inv #{{invoice_number}}. Pay here: {{payment_link}}", lastEdited: "2024-02-15" },
  { id: 4, name: "Final Notice", channel: "email", category: "Urgent", content: "IMPORTANT: Invoice {{invoice_number}} for {{amount}} is significantly overdue. Please arrange payment immediately.", lastEdited: "2024-02-10" },
  { id: 5, name: "WhatsApp Follow-up", channel: "whatsapp", category: "Friendly", content: "Hey {{customer_name}} 👋 Just checking in about invoice {{invoice_number}}. Let us know if you need anything!", lastEdited: "2024-02-08" },
  { id: 6, name: "Legal Warning", channel: "email", category: "Legal", content: "Dear {{customer_name}}, this is a formal notice regarding unpaid invoice {{invoice_number}}...", lastEdited: "2024-02-05" },
];

export const MOCK_PAYMENT_LINKS = [
  { id: 1, invoiceNumber: "INV-001", customer: "John Doe", amount: 500, created: "2024-02-25", expires: "2024-03-25", status: "active", used: false },
  { id: 2, invoiceNumber: "INV-004", customer: "Emily Davis", amount: 3200, created: "2024-02-20", expires: "2024-03-20", status: "active", used: false },
  { id: 3, invoiceNumber: "INV-003", customer: "John Doe", amount: 1000, created: "2024-01-20", expires: "2024-02-20", status: "paid", used: true },
  { id: 4, invoiceNumber: "INV-006", customer: "Robert Johnson", amount: 1250, created: "2024-01-15", expires: "2024-02-15", status: "expired", used: false },
];

export const MOCK_MESSAGES = [
  {
    id: 1,
    customerId: 1,
    customerName: "John Doe",
    messages: [
      { id: 1, direction: "outbound", channel: "email", content: "Hi John, this is a reminder that invoice INV-001 for $500 is due on March 1st.", timestamp: "2024-02-25T10:30:00", status: "delivered" },
      { id: 2, direction: "inbound", channel: "email", content: "Thanks for the reminder. I'll process the payment by end of this week.", timestamp: "2024-02-25T14:15:00", status: "read" },
      { id: 3, direction: "outbound", channel: "email", content: "Great, thank you John! Let me know if you need anything.", timestamp: "2024-02-25T14:30:00", status: "delivered" },
    ],
    unread: false,
    lastMessage: "Great, thank you John!",
    lastTimestamp: "2024-02-25T14:30:00",
  },
  {
    id: 2,
    customerId: 4,
    customerName: "Emily Davis",
    messages: [
      { id: 1, direction: "outbound", channel: "sms", content: "Hi Emily, invoice INV-004 for $3,200 is overdue. Please arrange payment.", timestamp: "2024-02-24T09:00:00", status: "delivered" },
      { id: 2, direction: "inbound", channel: "sms", content: "I'm having cash flow issues. Can we set up a payment plan?", timestamp: "2024-02-24T11:30:00", status: "read" },
    ],
    unread: true,
    lastMessage: "I'm having cash flow issues...",
    lastTimestamp: "2024-02-24T11:30:00",
  },
  {
    id: 3,
    customerId: 8,
    customerName: "Lisa Anderson",
    messages: [
      { id: 1, direction: "outbound", channel: "whatsapp", content: "Hey Lisa, just following up on invoice INV-007 for $5,600.", timestamp: "2024-02-23T16:00:00", status: "delivered" },
    ],
    unread: false,
    lastMessage: "Hey Lisa, just following up...",
    lastTimestamp: "2024-02-23T16:00:00",
  },
  {
    id: 4,
    customerId: 5,
    customerName: "Michael Chen",
    messages: [
      { id: 1, direction: "outbound", channel: "email", content: "Hi Michael, invoice INV-005 for $480 is due on March 28th.", timestamp: "2024-02-22T08:00:00", status: "delivered" },
      { id: 2, direction: "inbound", channel: "email", content: "Got it, will pay next week.", timestamp: "2024-02-22T12:00:00", status: "read" },
    ],
    unread: true,
    lastMessage: "Got it, will pay next week.",
    lastTimestamp: "2024-02-22T12:00:00",
  },
];

export const MOCK_CHART_DATA = {
  paymentTrends: [
    { month: "Sep", collected: 18000, outstanding: 12000 },
    { month: "Oct", collected: 22000, outstanding: 10000 },
    { month: "Nov", collected: 19000, outstanding: 14000 },
    { month: "Dec", collected: 25000, outstanding: 8000 },
    { month: "Jan", collected: 28000, outstanding: 9500 },
    { month: "Feb", collected: 24500, outstanding: 11000 },
  ],
  agingSummary: [
    { range: "0-30 days", amount: 4500 },
    { range: "31-60 days", amount: 8200 },
    { range: "61-90 days", amount: 3800 },
    { range: "90+ days", amount: 5600 },
  ],
  channelPerformance: [
    { name: "Email", value: 45, color: "hsl(239, 84%, 67%)" },
    { name: "SMS", value: 35, color: "hsl(142, 71%, 45%)" },
    { name: "WhatsApp", value: 20, color: "hsl(48, 96%, 47%)" },
  ],
  recoveryRate: [
    { month: "Sep", rate: 65 },
    { month: "Oct", rate: 72 },
    { month: "Nov", rate: 68 },
    { month: "Dec", rate: 78 },
    { month: "Jan", rate: 82 },
    { month: "Feb", rate: 78 },
  ],
};

export const MOCK_TEAM_MEMBERS = [
  { id: 1, name: "Alex Morgan", email: "alex@collectly.com", role: "Admin", avatar: "" },
  { id: 2, name: "Sam Rivera", email: "sam@collectly.com", role: "Agent", avatar: "" },
  { id: 3, name: "Chris Taylor", email: "chris@collectly.com", role: "Agent", avatar: "" },
];

export const MOCK_BILLING_HISTORY = [
  { id: 1, date: "2024-02-01", description: "Pro Plan - Monthly", amount: 49, status: "paid" },
  { id: 2, date: "2024-01-01", description: "Pro Plan - Monthly", amount: 49, status: "paid" },
  { id: 3, date: "2023-12-01", description: "Pro Plan - Monthly", amount: 49, status: "paid" },
  { id: 4, date: "2023-11-01", description: "Starter Plan - Monthly", amount: 19, status: "paid" },
];
