import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IUser } from '../../types/types'

interface UserState {
    user: IUser | null
    isAuth: boolean
}

const initialState: UserState = {
    user: null,
    isAuth: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    LoginSlice: (state, action : PayloadAction<IUser>) => {
        state.user = action.payload
        state.isAuth = true
    },
    LogoutSlice: (state, action) => {
        state.isAuth = false
        state.user = null
    }
  },
})

export const {LoginSlice, LogoutSlice } = userSlice.actions

export const selectCount = (state: RootState) => state.user

export default userSlice.reducer