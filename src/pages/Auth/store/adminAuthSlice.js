import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        admin: null,
        loading: false,
        error: null,
    },
    reducers: {
        setAdmin(state, action) {
            state.admin = {
                id: action.payload.id,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email,
                role: action.payload.role || 'admin',
                profileImageUrl: action.payload.profileImageUrl || null,
                createdAt: action.payload.createdAt || null,
            };
            state.error = null;
        },
        clearAdmin(state) {
            state.admin = null;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    }
});

export const { setAdmin, clearAdmin, setLoading, setError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;