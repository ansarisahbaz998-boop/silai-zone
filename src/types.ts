export interface CategoryItem {
  id: string;
  name: string;
  hindiName: string;
  image: string;
  popularFabric: string;
  description: string;
  turnaroundDays: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  hindiTitle?: string;
  category: string;
  stitchingType: string;
  description: string;
  image: string;
  tags: string[];
  turnaround: string;
  rating: number;
  createdAt: string;
}

export type InquiryUrgency = 'Normal (3-5 Days)' | 'Express (24-48 Hours)';

export type InquiryStatus = 
  | 'Pending' 
  | 'Measurement Taken' 
  | 'In Stitching' 
  | 'Ready for Trial' 
  | 'Delivered' 
  | 'Completed' 
  | 'Cancelled';

export interface CustomerInquiry {
  id: string;
  fullName: string;
  phone: string;
  category: string;
  requirements: string;
  preferredDate: string;
  urgency: InquiryUrgency;
  measurementSlipId?: string;
  hasOwnFabric: boolean;
  status: InquiryStatus;
  createdAt: string;
  adminNotes?: string;
}

export interface MeasurementSlip {
  id: string;
  customerName: string;
  phone: string;
  clothCategory: string;
  date: string;
  notes?: string;
  measurements: {
    // Upper body / Blouse & Kurti
    bustChest?: string;
    waist?: string;
    hip?: string;
    totalLength?: string;
    shoulder?: string;
    sleeveLength?: string;
    sleeveMori?: string;
    frontNeckDepth?: string;
    backNeckDepth?: string;
    armhole?: string;
    damanChak?: string;
    // Lower body / Salwar, Pant, Lehenga, Saya
    bottomLength?: string;
    bottomWaist?: string;
    bottomHip?: string;
    bottomMori?: string;
    thigh?: string;
    crotchRise?: string;
    // Special features
    cupPadded?: boolean;
    zipperSide?: 'Left' | 'Right' | 'Back' | 'None';
    liningFabric?: string;
  };
}

export interface BoutiqueInfo {
  name: string;
  tagline: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  address: string;
  locality: string;
  landmark: string;
  hours: string;
  sundayHours: string;
  adminPin: string;
}
