import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    languages:["eng","arm"],
    currentLanguage:"eng"
}

export const languageSlice = createSlice({
    name:"languages",
    initialState,
    reducers:{
        setLanguage(state,action){
            state.currentLanguage = action.payload
            localStorage.setItem(`lang`,state.currentLanguage)
        }
    }
})

export const selectLanguages = state => state.languages.languages
export const selectCurrentLanguage = state => state.languages.currentLanguage

export const {setLanguage} = languageSlice.actions
export default languageSlice.reducer