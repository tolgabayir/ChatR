import { UserDto } from "./Dto/UserDto";

export class Message {
    id?: string;
    sender: UserDto;
    receiver: UserDto;
    text: string;
    when: string;
    receiptInfo: boolean;
    isChecked: boolean;
    isDeleted: boolean;
    userIdWhoDelete?: string;
}