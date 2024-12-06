"use client"
import GetSubjects from "@/utils/getSubjects";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    subjects: [],
    loading: false,
    isFetched: false,
    error: null,
    isButtonLoading: false,
};

// * Create an async thunk to fetch todos
export const fetchSubjects = createAsyncThunk(
    'subjects/fetchSubjects',
    async () => {
        const response = {
            subjects: await GetSubjects(),
        };
        return response;
    }
);

export const subjectSlice = createSlice({
    name: "subjectSlice",
    initialState,
    reducers: {

        toggleButtonLoading: (state, action) => {
            state.isButtonLoading = action.payload;
        },

        addSubject: (state, action) => {
            state.subjects = [...state.subjects, action.payload];
        },

        deleteSubject: (state, action) => {
            state.subjects = state.subjects.filter((subject) => subject._id !== action.payload)
        },

        setPage: (state, action) => {
            state.subjects = state.subjects.map((item) => item._id === action.payload._id ? { ...item, page_history: action.payload.page_history } : item);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.subjects = action.payload.subjects;
                state.isFetched = true;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isFetched = false;
            });
    },
});

export const { toggleButtonLoading, addSubject, deleteSubject, setPage } = subjectSlice.actions;

export default subjectSlice.reducer;