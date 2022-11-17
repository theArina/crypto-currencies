import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'state',
  initialState: {
    rows: [],
    filteredRows: [],
    tickers: {},
    filteredTickers: [],
    currency: 'USD',
    filter: '',
    amount: 1,
    orderBy: 'name',
    order: 'asc',
  },
  reducers: {
    set: (state, { payload: [name, value] }) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state[name] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = slice.actions;

export default slice.reducer;
