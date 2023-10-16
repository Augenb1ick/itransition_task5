import { createContext } from 'react';
import { UsersContextType, UserDataType } from '../models/userData';

const defaultUserData: UserDataType = {
    email: '',
    isBlocked: false,
    lastLogin: '',
    name: '',
    regDate: '',
    _id: '',
};

export const UsersContext = createContext<UsersContextType>({
    currentUser: defaultUserData,
    users: [defaultUserData],
});
