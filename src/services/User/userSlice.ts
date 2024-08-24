import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, SetUserPayload } from './types';

const initialState: UserState = {
    accessToken: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserPayload>) => {
            state.accessToken = action.payload.accessToken;
        },
        clearUser: (state) => {
            state.accessToken = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
