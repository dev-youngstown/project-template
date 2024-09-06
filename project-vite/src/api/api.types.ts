import { AxiosError } from "axios";

interface ApiError {
    detail: string;
}

export interface IApiAxiosError extends AxiosError {
    response?: AxiosError<ApiError>["response"];
}

export interface Page<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface IFilter {
    q?: string;
    sort_by?: string;
    order?: "asc" | "desc";
}
