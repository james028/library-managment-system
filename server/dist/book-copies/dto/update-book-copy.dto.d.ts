declare const STATUSES: readonly ["available", "checked_out", "reserved", "lost", "under_repair"];
export declare class UpdateBookCopyDto {
    status?: (typeof STATUSES)[number];
    condition?: string;
}
export {};
