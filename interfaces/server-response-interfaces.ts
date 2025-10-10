import Error from "next/error";

export interface Result {
    status: number;
    message: string;
    data: any;
};

export interface ErrorResponse extends Error {
    message: string;
}