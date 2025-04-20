export interface Auth {
    token: string | null;
    expiresIn?: number;
    message?: string;
}
