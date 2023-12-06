import { configureStore, combineReducers } from '@reduxjs/toolkit'

import appReducer from 'redux/slicers/appSlice'

const rootReducer = combineReducers({ app: appReducer, })

export const store = configureStore({ reducer: rootReducer, })

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
