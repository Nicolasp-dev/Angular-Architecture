import { ActionReducerMap } from '@ngrx/store';

import * as fromDictionaries from './dictionaries';

export interface State {
  dictionaries: fromDictionaries.DictionariesState;
}

export const reducers: any = {
  dictionaries: fromDictionaries.reducer,
};

export const effects = [fromDictionaries.DictionariesEffects];
