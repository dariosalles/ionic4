export enum AuthProvider {
    Email,
    Facebook
}

export interface User {
    nome?: string;
    email: string;
    senha: string;

}

export interface AuthOptions {
    isSignIn: boolean;
    provider: AuthProvider;
    user: User;

}
