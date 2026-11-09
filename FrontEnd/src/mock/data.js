export const users = [
  {
    id: 1,
    fullName: "Asha Nair",
    email: "asha@agrisense.com",
    password: "Farm@123",
    role: "Farm Manager",
    phone: "+91 9876543210",
    address: "Coimbatore, Tamil Nadu",
    bio: "Independent farmer focused on sustainable irrigation and climate-resilient cultivation.",
    experience: "8 years",
    skills: ["Crop Planning", "Soil Care", "Market Knowledge"],
    farmCount: 3,
    cropCount: 8,
    achievements: ["Water Saver 2024", "Best Yield Award"],
  },
  {
    id: 2,
    fullName: "Ravi Menon",
    email: "ravi@agrisense.com",
    password: "Farm@123",
    role: "Farm Manager",
    phone: "+91 9876543211",
    address: "Mysuru, Karnataka",
    bio: "Operations-focused manager for large-scale farms and compliance reporting.",
    experience: "12 years",
    skills: ["Operations", "Irrigation Planning", "Compliance"],
    farmCount: 6,
    cropCount: 14,
    achievements: ["Efficiency Champion"],
  },
  {
    id: 3,
    fullName: "Dr. Priya Rao",
    email: "priya@agrisense.com",
    password: "Farm@123",
    role: "Expert",
    phone: "+91 9876543212",
    address: "Hyderabad, Telangana",
    bio: "Agriculture expert specializing in disease advisory and precision nutrient planning.",
    experience: "15 years",
    skills: ["Disease Diagnosis", "Consulting", "Strategy"],
    farmCount: 18,
    cropCount: 34,
    achievements: ["Top Advisor 2025"],
  },
  {
    id: 4,
    fullName: "Arjun Das",
    email: "admin@agrisense.com",
    password: "Farm@123",
    role: "Admin",
    phone: "+91 9876543213",
    address: "Bengaluru, Karnataka",
    bio: "Platform administrator overseeing enterprise operations, governance, and reporting.",
    experience: "10 years",
    skills: ["Platform Governance", "Security", "Reporting"],
    farmCount: 24,
    cropCount: 61,
    achievements: ["System Excellence"],
  },
];

export const farms = [
  {
    id: 1,
    name: "Green Valley Farm",
    owner: "Asha Nair",
    manager: "Ravi Menon",
    location: "Coimbatore",
    area: "48 acres",
    areaHa: 19.4,
    gps: "11.0168° N, 76.9558° E",
    soilType: "Loamy clay",
    waterSource: "Borewell + drip irrigation",
    currentCrop: "Tomato",
    status: "Healthy",
    healthScore: 94,
    efficiency: 92,
    lastUpdated: "12 min ago",
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Riverbend Fields",
    owner: "Asha Nair",
    manager: "Ravi Menon",
    location: "Erode",
    area: "63 acres",
    areaHa: 25.5,
    gps: "11.3410° N, 77.7172° E",
    soilType: "Clay loam",
    waterSource: "Canal + pump house",
    currentCrop: "Rice",
    status: "Monitoring",
    healthScore: 88,
    efficiency: 86,
    lastUpdated: "42 min ago",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Sundaram Orchards",
    owner: "Asha Nair",
    manager: "Ravi Menon",
    location: "Salem",
    area: "37 acres",
    areaHa: 15.0,
    gps: "11.6643° N, 78.1460° E",
    soilType: "Red laterite",
    waterSource: "Rainwater harvesting",
    currentCrop: "Banana",
    status: "Optimized",
    healthScore: 96,
    efficiency: 94,
    lastUpdated: "18 min ago",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
  },
];

export const crops = [
  {
    id: 1,
    name: "Tomato",
    stage: "Flowering",
    health: "Excellent",
    plantingDate: "2026-03-10",
    harvestDate: "2026-07-15",
    diseaseStatus: "Low risk",
    expectedYield: "14 tons/acre",
    marketPrice: "₹42/kg",
    image:
      "https://images.unsplash.com/photo-1598514982902-7f24876e69e2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Rice",
    stage: "Maturity",
    health: "Stable",
    plantingDate: "2026-01-20",
    harvestDate: "2026-06-30",
    diseaseStatus: "Moderate monitoring",
    expectedYield: "26 tons/acre",
    marketPrice: "₹31/kg",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Sugarcane",
    stage: "Tillering",
    health: "Excellent",
    plantingDate: "2025-12-05",
    harvestDate: "2026-10-18",
    diseaseStatus: "No active disease",
    expectedYield: "88 tons/acre",
    marketPrice: "₹3,200/ton",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Cotton",
    stage: "Boll formation",
    health: "Watch",
    plantingDate: "2026-04-12",
    harvestDate: "2026-09-20",
    diseaseStatus: "Early pest alert",
    expectedYield: "12 bales/acre",
    marketPrice: "₹58/kg",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Banana",
    stage: "Fruit development",
    health: "Excellent",
    plantingDate: "2025-10-03",
    harvestDate: "2026-08-02",
    diseaseStatus: "Low risk",
    expectedYield: "32 tons/acre",
    marketPrice: "₹24/kg",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Maize",
    stage: "Silking",
    health: "Stable",
    plantingDate: "2026-02-18",
    harvestDate: "2026-07-10",
    diseaseStatus: "No active disease",
    expectedYield: "18 tons/acre",
    marketPrice: "₹22/kg",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Groundnut",
    stage: "Pod filling",
    health: "Excellent",
    plantingDate: "2026-01-28",
    harvestDate: "2026-06-12",
    diseaseStatus: "Low risk",
    expectedYield: "11 tons/acre",
    marketPrice: "₹48/kg",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Wheat",
    stage: "Grain filling",
    health: "Stable",
    plantingDate: "2025-11-14",
    harvestDate: "2026-04-26",
    diseaseStatus: "Moderate monitoring",
    expectedYield: "15 tons/acre",
    marketPrice: "₹26/kg",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
  },
];

export const weatherData = {
  location: "Coimbatore, Tamil Nadu",
  current: {
    temp: 31,
    humidity: 68,
    rainfall: 4,
    windSpeed: 18,
    uvIndex: 7,
    sunrise: "06:02",
    sunset: "18:53",
    condition: "Partly cloudy",
  },
  forecast: [
    { day: "Mon", high: 32, low: 24, rainfall: 28, condition: "Cloudy" },
    { day: "Tue", high: 34, low: 25, rainfall: 10, condition: "Sunny" },
    { day: "Wed", high: 30, low: 23, rainfall: 62, condition: "Rain" },
    { day: "Thu", high: 31, low: 24, rainfall: 18, condition: "Clear" },
    { day: "Fri", high: 33, low: 25, rainfall: 12, condition: "Sunny" },
    { day: "Sat", high: 29, low: 23, rainfall: 55, condition: "Storm" },
    { day: "Sun", high: 32, low: 24, rainfall: 20, condition: "Clear" },
  ],
  alerts: [
    {
      type: "Rain Alert",
      message:
        "Heavy rain expected tomorrow. Avoid irrigation between 14:00 and 17:00.",
    },
    {
      type: "Heat Wave",
      message:
        "Peak afternoon heat will raise evapotranspiration through Wednesday.",
    },
  ],
};

export const notifications = [
  {
    id: 1,
    title: "Irrigation Reminder",
    description:
      "Drip irrigation cycle for Green Valley Farm starts at 6:00 PM.",
    time: "10 min ago",
    unread: true,
    category: "Water",
  },
  {
    id: 2,
    title: "Government Scheme",
    description:
      "New subsidy for micro-irrigation equipment is now live for eligible cooperatives.",
    time: "1 hr ago",
    unread: false,
    category: "Policy",
  },
  {
    id: 3,
    title: "Disease Alert",
    description:
      "Early signs of fungal pressure were detected in the western cotton plots.",
    time: "3 hrs ago",
    unread: true,
    category: "Crop",
  },
  {
    id: 4,
    title: "Harvest Reminder",
    description:
      "Banana harvest at Sundaram Orchards is scheduled for next week.",
    time: "5 hrs ago",
    unread: false,
    category: "Operation",
  },
];

export const schemes = [
  {
    id: 1,
    title: "Drip Irrigation Subsidy",
    description:
      "Financial support for installation of high-efficiency drip systems in water-stressed districts.",
    eligibility:
      "Farmers with landholding up to 10 acres and registered Aadhaar.",
    lastDate: "31 Aug 2026",
    status: "Open",
    category: "Subsidy",
  },
  {
    id: 2,
    title: "Crop Insurance Support",
    description:
      "Premium reimbursement for weather-indexed crop insurance on major food grains and cash crops.",
    eligibility: "Farmers with active land records and a valid bank account.",
    lastDate: "18 Sep 2026",
    status: "Popular",
    category: "Insurance",
  },
  {
    id: 3,
    title: "Soil Health Grant",
    description:
      "Support for soil testing, nutrient balancing, and organic amendment adoption.",
    eligibility:
      "Registered agricultural cooperatives and individual cultivators with soil health cards.",
    lastDate: "22 Oct 2026",
    status: "New",
    category: "Grant",
  },
];

export const marketPrices = [
  {
    crop: "Tomato",
    marketName: "Coimbatore Regulated Market",
    priceToday: "₹42/kg",
    yesterdayPrice: "₹39/kg",
    trend: "Up 7.7%",
    bestMarket: true,
  },
  {
    crop: "Rice",
    marketName: "Erode Wholesale Centre",
    priceToday: "₹31/kg",
    yesterdayPrice: "₹30/kg",
    trend: "Up 3.3%",
    bestMarket: false,
  },
  {
    crop: "Cotton",
    marketName: "Mysuru Commodity Yard",
    priceToday: "₹58/kg",
    yesterdayPrice: "₹59/kg",
    trend: "Down 1.7%",
    bestMarket: false,
  },
  {
    crop: "Banana",
    marketName: "Salem Fruit Market",
    priceToday: "₹24/kg",
    yesterdayPrice: "₹23/kg",
    trend: "Up 4.3%",
    bestMarket: true,
  },
];

export const soilReports = [
  {
    id: 1,
    farmName: "Green Valley Farm",
    ph: 6.8,
    nitrogen: "72 kg/ha",
    phosphorus: "48 kg/ha",
    potassium: "61 kg/ha",
    organicMatter: "1.8%",
    moisture: "28%",
    soilType: "Loamy clay",
    recommendation:
      "Apply compost and reduce nitrogen dosing by 10% during the next cycle.",
  },
  {
    id: 2,
    farmName: "Riverbend Fields",
    ph: 7.2,
    nitrogen: "68 kg/ha",
    phosphorus: "42 kg/ha",
    potassium: "57 kg/ha",
    organicMatter: "1.5%",
    moisture: "24%",
    soilType: "Clay loam",
    recommendation:
      "Schedule a gypsum application and maintain irrigation at field capacity.",
  },
];

export const reports = [
  {
    id: 1,
    title: "Farm Report",
    summary: "Field health index improved by 6.4% over the last 30 days.",
    range: "Apr 2026",
  },
  {
    id: 2,
    title: "Crop Report",
    summary:
      "Tomato and banana plots are trending above the seasonal yield median.",
    range: "This quarter",
  },
  {
    id: 3,
    title: "Water Usage",
    summary:
      "Drip irrigation reduced consumption by 18% versus flood irrigation.",
    range: "Last 60 days",
  },
  {
    id: 4,
    title: "Revenue",
    summary: "Revenue yield exceeded the monthly forecast by 9.1%.",
    range: "May 2026",
  },
  {
    id: 5,
    title: "Expenses",
    summary: "Input cost remained below the seasonal budget by 5.6%.",
    range: "May 2026",
  },
  {
    id: 6,
    title: "Harvest Report",
    summary:
      "Rice and banana harvest windows are aligned with the current procurement calendar.",
    range: "Jun 2026",
  },
];

export const analytics = {
  revenue: [72, 78, 81, 85, 88, 91, 94],
  waterUsage: [88, 85, 83, 80, 78, 76, 74],
  farmPerformance: [80, 83, 85, 87, 89, 91, 93],
};

export const upagStats = {
  riceProductionThirdAdvance: 198.05,
  riceTopStates: [
    { state: "Uttar Pradesh", value: 198.05 },
    { state: "Telangana", value: 185.29 },
    { state: "West Bengal", value: 171.35 },
    { state: "Punjab", value: 125.33 },
    { state: "Andhra Pradesh", value: 105.85 },
  ],
  commercialCropProduction: [
    { crop: "Sugarcane", value: 5000.63, unit: "lakh tonnes" },
    { crop: "Cotton", value: 290.24, unit: "lakh tonnes" },
    { crop: "Jute", value: 91.76, unit: "lakh tonnes" },
    { crop: "Mesta", value: 2.27, unit: "lakh tonnes" },
  ],
  latestReports: [
    { title: "CWWG Weekly Report", date: "06 July 2026" },
    { title: "Crops, Rainfall, Reservoir Situation", date: "06 July 2026" },
    { title: "CWWG Weekly Report", date: "29 June 2026" },
  ],
};