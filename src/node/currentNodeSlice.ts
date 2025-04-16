import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../build/store';
import { LocalNodeType } from './localNodesApi';

export interface CurrentNodeState {
  value: LocalNodeType;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CurrentNodeState = {
  value: {
    node_id: '',
    name: '',
    backend_url: '',
    wallet_address: '',},
  status: 'idle',
};

export const currentNodeSlice = createSlice({
  name: 'currentNode',
  initialState,
  reducers: {
    setCurrentNode: (state, action: PayloadAction<LocalNodeType>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentNode } = currentNodeSlice.actions;
export const selectCurrentNode = (state: RootState) => state.currentNode.value;
export default currentNodeSlice.reducer;