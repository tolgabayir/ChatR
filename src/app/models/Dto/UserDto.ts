export class UserDto {
    accessFailedCount: number;
    concurrencyStamp: string;
    connections: any;
    email: string;
    emailConfirmed: boolean;
    id: string;
    lockoutEnabled: boolean;
    lockoutEnd: string
    normalizedEmail: string;
    normalizedUserName: string;
    passwordHash: string;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    securityStamp: string;
    twoFactorEnabled: boolean;
    userName: string;
    unReadedMessages: number;

}