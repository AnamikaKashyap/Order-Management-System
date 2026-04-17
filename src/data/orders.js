export const orders = [
  {
    id: "ORD001",
    title: "iPhone 14 Order",
    customer: { name: "Aditya Ranjan", email: "aditya@gmail.com", phone: "9876543210" },
    status: "pending",
    priority: "high",
    date: "2026-04-15",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-15" },
      { status: "Processing", date: "" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Urgent delivery required"
  },
  {
    id: "ORD002",
    title: "MacBook Pro 14-inch Order",
    customer: { name: "Sonal Verma", email: "sonal.verma@example.com", phone: "9123456780" },
    status: "in-progress",
    priority: "high",
    date: "2026-04-14",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-14" },
      { status: "Processing", date: "2026-04-15" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Include charger and protective case"
  },
  {
    id: "ORD003",
    title: "Samsung Galaxy S23 Order",
    customer: { name: "Ravi Kumar", email: "ravi.kumar@example.com", phone: "9012345678" },
    status: "completed",
    priority: "medium",
    date: "2026-04-10",
    assignedTo: "Vikram Patel",
    timeline: [
      { status: "Order Placed", date: "2026-04-10" },
      { status: "Processing", date: "2026-04-11" },
      { status: "Shipped", date: "2026-04-12" },
      { status: "Delivered", date: "2026-04-13" }
    ],
    notes: "Delivered to reception"
  },
  {
    id: "ORD004",
    title: "AirPods Pro",
    customer: { name: "Meera Singh", email: "meera.singh@example.com", phone: "9988776655" },
    status: "pending",
    priority: "low",
    date: "2026-04-16",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-16" },
      { status: "Processing", date: "" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Gift wrap if possible"
  },
  {
    id: "ORD005",
    title: "iPad Air",
    customer: { name: "Karan Malhotra", email: "karan.m@example.com", phone: "9898989898" },
    status: "in-progress",
    priority: "medium",
    date: "2026-04-12",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-12" },
      { status: "Processing", date: "2026-04-13" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Include screen protector"
  },
  {
    id: "ORD006",
    title: "Dell XPS 13",
    customer: { name: "Ananya Rao", email: "ananya.rao@example.com", phone: "9776655443" },
    status: "cancelled",
    priority: "medium",
    date: "2026-04-09",
    assignedTo: "Vikram Patel",
    timeline: [
      { status: "Order Placed", date: "2026-04-09" },
      { status: "Processing", date: "2026-04-10" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Customer cancelled due to pricing"
  },
  {
    id: "ORD007",
    title: "Sony WH-1000XM5",
    customer: { name: "Pooja Desai", email: "pooja.desai@example.com", phone: "9665544332" },
    status: "completed",
    priority: "low",
    date: "2026-04-05",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-05" },
      { status: "Processing", date: "2026-04-06" },
      { status: "Shipped", date: "2026-04-07" },
      { status: "Delivered", date: "2026-04-08" }
    ],
    notes: "Left at doorstep"
  },
  {
    id: "ORD008",
    title: "Nintendo Switch OLED",
    customer: { name: "Amit Joshi", email: "amit.joshi@example.com", phone: "9554433221" },
    status: "in-progress",
    priority: "high",
    date: "2026-04-13",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-13" },
      { status: "Processing", date: "2026-04-14" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Customer requested express shipping"
  },
  {
    id: "ORD009",
    title: "Google Pixel 7",
    customer: { name: "Sneha Patel", email: "sneha.patel@example.com", phone: "9443322110" },
    status: "pending",
    priority: "medium",
    date: "2026-04-15",
    assignedTo: "Vikram Patel",
    timeline: [
      { status: "Order Placed", date: "2026-04-15" },
      { status: "Processing", date: "" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Verify color before dispatch"
  },
  {
    id: "ORD010",
    title: "Amazon Kindle Paperwhite",
    customer: { name: "Rohit Sen", email: "rohit.sen@example.com", phone: "9332211009" },
    status: "completed",
    priority: "low",
    date: "2026-04-02",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-02" },
      { status: "Processing", date: "2026-04-03" },
      { status: "Shipped", date: "2026-04-04" },
      { status: "Delivered", date: "2026-04-06" }
    ],
    notes: "Customer happy with delivery"
  },
  {
    id: "ORD011",
    title: "HP Envy Laptop",
    customer: { name: "Deepak Nair", email: "deepak.nair@example.com", phone: "9223344556" },
    status: "in-progress",
    priority: "high",
    date: "2026-04-11",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-11" },
      { status: "Processing", date: "2026-04-12" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Call before delivery"
  },
  {
    id: "ORD012",
    title: "OnePlus 10 Pro",
    customer: { name: "Nidhi Mehra", email: "nidhi.mehra@example.com", phone: "9112233445" },
    status: "pending",
    priority: "medium",
    date: "2026-04-16",
    assignedTo: "Vikram Patel",
    timeline: [
      { status: "Order Placed", date: "2026-04-16" },
      { status: "Processing", date: "" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Customer to pick delivery slot"
  },
  {
    id: "ORD013",
    title: "Fitbit Charge 5",
    customer: { name: "Gaurav Bhatia", email: "gaurav.b@example.com", phone: "9001122334" },
    status: "completed",
    priority: "low",
    date: "2026-04-03",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-03" },
      { status: "Processing", date: "2026-04-04" },
      { status: "Shipped", date: "2026-04-05" },
      { status: "Delivered", date: "2026-04-07" }
    ],
    notes: "Include original invoice"
  },
  {
    id: "ORD014",
    title: "GoPro HERO10",
    customer: { name: "Isha Kapoor", email: "isha.kapoor@example.com", phone: "9887766554" },
    status: "in-progress",
    priority: "high",
    date: "2026-04-13",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-13" },
      { status: "Processing", date: "2026-04-14" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Ship with extra battery"
  },
  {
    id: "ORD015",
    title: "Logitech MX Master 3",
    customer: { name: "Suresh Nair", email: "suresh.nair@example.com", phone: "9770011223" },
    status: "pending",
    priority: "low",
    date: "2026-04-15",
    assignedTo: "Vikram Patel",
    timeline: [
      { status: "Order Placed", date: "2026-04-15" },
      { status: "Processing", date: "" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Deliver during office hours"
  },
  {
    id: "ORD016",
    title: "Canon EOS R6",
    customer: { name: "Priya Sharma", email: "priya.sharma@example.com", phone: "9660011223" },
    status: "completed",
    priority: "high",
    date: "2026-04-01",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-01" },
      { status: "Processing", date: "2026-04-02" },
      { status: "Shipped", date: "2026-04-04" },
      { status: "Delivered", date: "2026-04-06" }
    ],
    notes: "Handle with care"
  },
  {
    id: "ORD017",
    title: "Microsoft Surface Pro",
    customer: { name: "Vandana Iyer", email: "vandana.iyer@example.com", phone: "9550011223" },
    status: "in-progress",
    priority: "medium",
    date: "2026-04-12",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-12" },
      { status: "Processing", date: "2026-04-13" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Include keyboard cover"
  },
  {
    id: "ORD018",
    title: "Bose SoundLink Revolve",
    customer: { name: "Kavita Singh", email: "kavita.singh@example.com", phone: "9440011223" },
    status: "pending",
    priority: "low",
    date: "2026-04-16",
    assignedTo: "Vikram Patel",
    timeline: [
      { status: "Order Placed", date: "2026-04-16" },
      { status: "Processing", date: "" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Customer requested eco-friendly packaging"
  },
  {
    id: "ORD019",
    title: "Samsung T7 SSD",
    customer: { name: "Manish Kumar", email: "manish.kumar@example.com", phone: "9221100334" },
    status: "completed",
    priority: "medium",
    date: "2026-04-07",
    assignedTo: "Rahul Sharma",
    timeline: [
      { status: "Order Placed", date: "2026-04-07" },
      { status: "Processing", date: "2026-04-08" },
      { status: "Shipped", date: "2026-04-09" },
      { status: "Delivered", date: "2026-04-10" }
    ],
    notes: "Deliver to IT department"
  },
  {
    id: "ORD020",
    title: "External Monitor 27\"",
    customer: { name: "Alok Verma", email: "alok.verma@example.com", phone: "9114455667" },
    status: "in-progress",
    priority: "high",
    date: "2026-04-14",
    assignedTo: "Neha Gupta",
    timeline: [
      { status: "Order Placed", date: "2026-04-14" },
      { status: "Processing", date: "2026-04-15" },
      { status: "Shipped", date: "" },
      { status: "Delivered", date: "" }
    ],
    notes: "Fragile: mark as handle with care"
  }
]