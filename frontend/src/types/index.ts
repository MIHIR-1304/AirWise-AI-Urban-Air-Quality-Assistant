export interface PollutantDetail {
  code: string; // PM2.5, PM10, NO2, O3, SO2, CO
  name: string;
  value: number;
  unit: string;
  status: 'Good' | 'Moderate' | 'Poor' | 'Severe' | 'Normal' | 'Elevated';
  color: string;
  description: string;
  whoGuideline: number;
}

export interface HourlyTrendPoint {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
}

export interface ForecastDay {
  day: string;
  date: string;
  aqi: number;
  category: string;
  color: string;
  maxTemp: number;
  minTemp: number;
  summary: string;
}

export interface HealthAdvisory {
  generalMessage: string;
  sensitiveGroupsMessage: string;
  maskGuidance: string;
  windowVentilation: string;
  outdoorExercise: string;
}

export interface ActivitySafety {
  status: 'SAFE' | 'CAUTION' | 'NOT_RECOMMENDED' | 'HAZARDOUS';
  advice: string;
  recommendedTime: string;
}

export interface OutdoorSafety {
  running: ActivitySafety;
  cycling: ActivitySafety;
  walking: ActivitySafety;
  childrenAndSeniors: ActivitySafety;
}

export interface AirQualityResponse {
  locationName: string;
  country?: string;
  latitude: number;
  longitude: number;
  aqi: number;
  aqiCategory: string;
  aqiColor: string;
  dominantPollutant: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  weatherDescription: string;
  uvIndex?: number;
  pm25?: number;
  pm10?: number;
  recordedAt: string;
  source: string;
  pollutants: PollutantDetail[];
  hourlyTrend: HourlyTrendPoint[];
  forecast: ForecastDay[];
  healthAdvisory: HealthAdvisory;
  outdoorSafety: OutdoorSafety;
}

export interface UserPreference {
  defaultCity: string;
  defaultLat?: number;
  defaultLon?: number;
  hasInfants: boolean;
  hasElderly: boolean;
  hasRespiratoryIssues: boolean;
  preferredCommute: string;
  notifySmogAlerts: boolean;
  notifyMorningBriefing: boolean;
  notifyPurifierReminders: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  persona: 'STUDENT' | 'WORKING_PROFESSIONAL' | 'PARENT' | 'SENIOR' | 'ATHLETE';
  preferences?: UserPreference;
}

export interface ChatMessage {
  id?: number;
  senderRole: 'USER' | 'ASSISTANT' | 'SYSTEM';
  messageContent: string;
  timestamp?: string;
  sourceAttribution?: string;
  suggestedFollowUps?: string[];
}

export interface PersonalizedGuidance {
  headline: string;
  summary: string;
  exposureRiskLevel: string;
  morningRoutine: string;
  commuteStrategy: string;
  indoorAirStrategy: string;
  eveningRoutine: string;
  maskRecommendation: string;
  dietAndHydrationTip: string;
  rationaleBullets: string[];
  sourceAttribution: string;
}

export interface RoutineActivity {
  id: number;
  timeSlot: string;
  activityType: string;
  suggestedActivity: string;
  reason: string;
  exposureLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  alternativeAction: string;
  isCompleted: boolean;
}

export interface DailyRoutine {
  id: number;
  routineDate: string;
  summary: string;
  overallExposureRisk: string;
  activities: RoutineActivity[];
}

export interface RoomChecklistItem {
  id: string;
  roomName: string;
  task: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  isDone: boolean;
}

export interface CookingSafetyTip {
  title: string;
  instruction: string;
  estimatedPm25Reduction: string;
}

export interface PlantRealityCheck {
  headline: string;
  fact: string;
  realisticBenefit: string;
  limitation: string;
  recommendedSpecies: string[];
}

export interface IndoorGuidanceResponse {
  outdoorAqi: number;
  windowVentilationAllowed: boolean;
  ventilationVerdict: string;
  bestVentilationWindow: string;
  airPurifierSpeedRecommendation: string;
  targetAirChangesPerHour: number;
  recommendedCadrForTypicalRoom: number;
  roomChecklist: RoomChecklistItem[];
  plantRealityCheck: PlantRealityCheck;
  cookingTips: CookingSafetyTip[];
}

export interface TransportOption {
  mode: string;
  label: string;
  co2EmittedKg: number;
  co2SavedVsCarKg: number;
  pm25AvoidedG: number;
  exposureRisk: string;
  recommendation: string;
  estMinutes: number;
}

export interface CommuteComparison {
  distanceKm: number;
  options: TransportOption[];
  methodology: string;
}

export interface LoggedTrip {
  id: number;
  tripDate: string;
  transportMode: string;
  distanceKm: number;
  co2SavedKg: number;
  pm25AvoidedG: number;
  notes?: string;
}

export interface ImpactSummary {
  totalCo2SavedKg: number;
  totalPm25AvoidedG: number;
  totalDistanceKm: number;
  cleanAirDaysCount: number;
  equivalentTreesPlanted: number;
  recentTrips: LoggedTrip[];
  calculationDisclaimer: string;
}

export interface CitySearchResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}
