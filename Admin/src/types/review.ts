export type ReviewTargetType = "room" | "service" | "location" | string;
export type ReviewStatus = "active" | "hidden" | "deleted" | string;

export interface UserRef { _id: string; fullName?: string; email?: string }

export interface ReviewItem {
  _id: string;
  reviewerId?: UserRef | null;
  targetType: ReviewTargetType;
  targetId: string; // objectId string of target
  rating: number; // 1..5
  comment?: string;
  status: ReviewStatus;
  createdAt?: string;
  updatedAt?: string;
}
