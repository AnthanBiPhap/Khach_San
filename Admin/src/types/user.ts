export interface User {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: "active" | "inactive";
    preferences: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Pagination {
    totalRecord: number;
    limit: number;
    page: number;
  }
  
  export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
  }