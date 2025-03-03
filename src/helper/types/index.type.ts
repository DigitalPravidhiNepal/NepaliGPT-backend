
export enum roleType {
    superAdmin = 'superAdmin',
    customer = 'customer'
}

export enum enrollStatus {
    approved = "approved",
    pending = "pending",
    reject = "reject"
}

export enum tableStatus {
    occupied = 'occupied',
    available = 'available'
}


export enum orderStatus {
    pending = 'pending',
    accepted = 'accepted',
    completed = "completed",
    partiallyDelivered = "partiallyDelivered",
    cancelled = "cancelled"
}

export enum orderItemStatus {
    pending = 'pending',
    accepted = 'accepted',
    completed = "completed",
    delivered = "delivered",
    canceled = "canceled"
}

export enum orderType {
    table = 'table',
    // quick='quick',
    receptionist = 'receptionist'
}

export enum documentType {
    citizenship = "citizenship",
    pan = "pan",
    drivingLicense = "drivingLicense",
    passport = "passport"
}

export enum paymentMethod {
    online = "online",
    cash = "cash",
    esewa = "esewa",
    khalti = "khalti",
    bankTransfer = "bankTransfer"
}

export enum priorityType {
    low = "low",
    medium = "medium",
    high = "high",
    critical = "critical"
}

export enum requestType {
    technicalGlitches = "technicalGlitches",
    participantManagement = "participantManagement"
}

export enum billingStatus {
    paid = "paid",
    partiallyPaid = "partiallyPaid",
    unpaid = "unpaid"
}

export enum paymentStatus {
    approved = "approved",
    pending = "pending",
    reject = "reject"
}

export enum genderType {
    male = "male",
    female = "female",
    others = "others"
}

export type JwtPayload = {
    sub: string;
    role: string;
};

export interface clientEventId {
    clientId: string,
    eventId: string,
}

export enum otpRequestType {
    register = "register",
    forgotPassword = 'forgotPassword'
}
export enum RestaurantStatus {
    active = "active",
    inactive = "inactive"
}

export enum CategoryStatus {
    available = "available",
    unavailabe = "unavailable"
}

export enum ProductStatus {
    available = "available",
    unavailabe = "unavailable"
}

export enum JobNames {
    PROCESS_ORDER = 'process-order',
    SEND_NOTIFICATION = 'send-notification',
};

export type DateRangeType = 'day' | 'week' | 'month';

export enum dateType {
    day = 'day',
    week = 'week',
    month = 'month'
}

export enum PermissionType {
    CATEGORY_MANAGEMENT = 'Category Management',
    ORDER_MANAGEMENT = 'Order Management',
    TABLE_MANAGEMENT = 'Table Management',
    PRODUCT_MANAGEMENT = 'Product Management',
    ROLE_MANAGEMENT = 'Role Management',
}

export enum AccessType {
    FREE = 'Free',
    STANDARD = 'Standard',
    PREMIUM = 'Premium'
}

export type VerifyPayload = {
    email: string;
};

export enum SpeechTone {
    NEUTRAL = 'neutral',
    PROFESSIONAL = 'professional',
    STORYTELLING = 'storytelling',
    FRIENDLY = 'friendly',
    ROBOTIC = 'robotic',
    RELAXING = 'relaxing'
}

export enum Creativity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum DocumentName {
    Template = 'Template',
    Image = 'Image',
    Code = 'Code',
    SpeechToText = 'SpeechToText',
    TextToSpeech = 'TextToSpeech',
}

export enum inputType {
    TEXT = "text",
    TEXTAREA = "text-area",
    NUMBER = "number"
}
export enum category {
    BLOG = "Blog",
    TEXT = "Text",
    SOCIAL = "Social",
    VIDEO = "Video",
    DISCUSSION = "Discussion",
    FAQ = "Faq",
    OTHERS = "Others"
}

export enum Language {
    ENGLISH = "English",
    SPANISH = "Spanish",
    FRENCH = "French",
    GERMAN = "German",
    CHINESE = "Chinese",
    JAPANESE = "Japanese",
    HINDI = "Hindi",
    ARABIC = "Arabic",
    PORTUGUESE = "Portuguese",
    RUSSIAN = "Russian",
    KOREAN = "Korean",
    ITALIAN = "Italian",
    DUTCH = "Dutch",
    TURKISH = "Turkish",
    SWEDISH = "Swedish",
    POLISH = "Polish",
    INDONESIAN = "Indonesian",
    VIETNAMESE = "Vietnamese",
    THAI = "Thai",
    HEBREW = "Hebrew",
    GREEK = "Greek",
    DANISH = "Danish",
    FINNISH = "Finnish",
    NORWEGIAN = "Norwegian",
    NEPALI = "Nepali"
}

