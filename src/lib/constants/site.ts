// Structural, non-translatable site data. Translatable copy lives in src/messages/*.json
// and is looked up by the `slug` values below (e.g. services.items.<slug>.title).
//
// NOTE: Contact details and statistics below are placeholders for local development
// and design review. Replace with verified figures and live contact details from the
// Admin > Settings screen before launch.

export const siteConfig = {
  name: "JSS",
  legalName: "Jyothi Security Services",
  shortName: "JSS",
  url: "https://www.jyothisecurityservices.in",
  phone: "+91 90368 88482",
  phoneDisplay: "+91 90368 88482",
  whatsapp: "919036888482",
  email: "rachithaammujk2004@gmail.com",
  emergencyPhone: "+91 90368 88482",
  address: {
    line1: "Near Kolar Tomato Market",
    line2: "Kolar, Karnataka 563101",
    country: "India",
  },
  mapEmbedSrc:
    "https://www.google.com/maps?q=Kolar+Tomato+Market,+Kolar,+Karnataka&output=embed",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
  workingHours: {
    office: "Mon – Sat, 9:00 AM – 7:00 PM",
    support: "24 x 7 Emergency Response",
  },
} as const;

export const navLinks = [
  { slug: "home", href: "/" },
  { slug: "about", href: "/about" },
  { slug: "services", href: "/services" },
  { slug: "industries", href: "/industries" },
  { slug: "training", href: "/training" },
  { slug: "history", href: "/history" },
  { slug: "gallery", href: "/gallery" },
  { slug: "testimonials", href: "/testimonials" },
  { slug: "contact", href: "/contact" },
] as const;

// Icon names map to lucide-react component names, resolved via the Icon registry
// in src/components/icons/icon-map.tsx to keep this file server/edge safe.
export const statItems = [
  { slug: "yearsExperience", value: 12, suffix: "+", icon: "CalendarRange" },
  { slug: "securityGuards", value: 500, suffix: "+", icon: "Users" },
  { slug: "industriesProtected", value: 25, suffix: "+", icon: "Factory" },
  { slug: "schoolsProtected", value: 60, suffix: "+", icon: "GraduationCap" },
  { slug: "companiesServed", value: 150, suffix: "+", icon: "Building2" },
  { slug: "clientsServed", value: 300, suffix: "+", icon: "Handshake" },
  { slug: "citiesCovered", value: 10, suffix: "+", icon: "MapPin" },
] as const;

export const serviceItems = [
  { slug: "schoolSecurity", icon: "GraduationCap" },
  { slug: "collegeSecurity", icon: "BookOpen" },
  { slug: "hospitalSecurity", icon: "HeartPulse" },
  { slug: "industrySecurity", icon: "Factory" },
  { slug: "factorySecurity", icon: "Cog" },
  { slug: "corporateOfficeSecurity", icon: "Building2" },
  { slug: "apartmentSecurity", icon: "Home" },
  { slug: "warehouseSecurity", icon: "Warehouse" },
  { slug: "constructionSiteSecurity", icon: "HardHat" },
  { slug: "bankSecurity", icon: "Landmark" },
  { slug: "shoppingMallSecurity", icon: "ShoppingBag" },
  { slug: "eventSecurity", icon: "PartyPopper" },
  { slug: "residentialSecurity", icon: "House" },
  { slug: "nightPatrol", icon: "Moon" },
  { slug: "escortServices", icon: "Car" },
  { slug: "womenSecurityGuards", icon: "UserRound" },
  { slug: "armedGuards", icon: "ShieldCheck" },
  { slug: "unarmedGuards", icon: "Shield" },
  { slug: "visitorManagement", icon: "ClipboardCheck" },
  { slug: "emergencyResponse", icon: "Siren" },
] as const;

export const industryItems = [
  { slug: "schools", icon: "GraduationCap" },
  { slug: "colleges", icon: "BookOpen" },
  { slug: "hospitals", icon: "HeartPulse" },
  { slug: "factories", icon: "Cog" },
  { slug: "industries", icon: "Factory" },
  { slug: "corporateOffices", icon: "Building2" },
  { slug: "warehouses", icon: "Warehouse" },
  { slug: "banks", icon: "Landmark" },
  { slug: "hotels", icon: "BedDouble" },
  { slug: "retailStores", icon: "Store" },
  { slug: "shoppingMalls", icon: "ShoppingBag" },
  { slug: "constructionCompanies", icon: "HardHat" },
  { slug: "residentialCommunities", icon: "Home" },
  { slug: "governmentOffices", icon: "Landmark" },
] as const;

export const trainingItems = [
  { slug: "physicalTraining", icon: "Dumbbell" },
  { slug: "discipline", icon: "ShieldCheck" },
  { slug: "fireSafety", icon: "Flame" },
  { slug: "emergencyResponse", icon: "Siren" },
  { slug: "visitorHandling", icon: "Users" },
  { slug: "communicationSkills", icon: "MessagesSquare" },
  { slug: "professionalBehaviour", icon: "BadgeCheck" },
  { slug: "firstAid", icon: "HeartPulse" },
  { slug: "nightPatrol", icon: "Moon" },
  { slug: "accessControl", icon: "KeyRound" },
  { slug: "professionalEthics", icon: "Scale" },
  { slug: "uniformStandards", icon: "Shirt" },
] as const;

export const historyMilestones = [
  { slug: "foundation", icon: "Flag" },
  { slug: "growth", icon: "TrendingUp" },
  { slug: "expansion", icon: "Map" },
  { slug: "diversification", icon: "Layers" },
  { slug: "today", icon: "Building2" },
  { slug: "future", icon: "Rocket" },
] as const;

export const galleryCategories = [
  { slug: "training", icon: "Dumbbell" },
  { slug: "schoolSecurity", icon: "GraduationCap" },
  { slug: "industrySecurity", icon: "Factory" },
  { slug: "officeSecurity", icon: "Building2" },
  { slug: "patrolling", icon: "Footprints" },
  { slug: "nightPatrol", icon: "Moon" },
  { slug: "events", icon: "PartyPopper" },
  { slug: "uniformInspection", icon: "BadgeCheck" },
] as const;

export const testimonialItems = [
  { slug: "schoolPrincipal", initials: "RN" },
  { slug: "factoryManager", initials: "SK" },
  { slug: "apartmentAssociation", initials: "MP" },
  { slug: "warehouseOwner", initials: "AV" },
  { slug: "companyHr", initials: "PD" },
] as const;

export const requestGuardTypes = [
  { slug: "school", icon: "GraduationCap" },
  { slug: "college", icon: "BookOpen" },
  { slug: "hospital", icon: "HeartPulse" },
  { slug: "industry", icon: "Factory" },
  { slug: "factory", icon: "Cog" },
  { slug: "office", icon: "Building2" },
  { slug: "warehouse", icon: "Warehouse" },
  { slug: "apartment", icon: "Home" },
  { slug: "bank", icon: "Landmark" },
  { slug: "hotel", icon: "BedDouble" },
  { slug: "constructionSite", icon: "HardHat" },
  { slug: "shoppingMall", icon: "ShoppingBag" },
  { slug: "other", icon: "MoreHorizontal" },
] as const;

export const languageOptions = [
  { slug: "kannada" },
  { slug: "english" },
  { slug: "hindi" },
  { slug: "telugu" },
  { slug: "tamil" },
] as const;
