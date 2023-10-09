import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';

import { Observable, of, zip } from 'rxjs';
import { map, switchMap, catchError, take, tap } from 'rxjs/operators';

import {
  Dictionaries,
  Dictionary,
  Item,
  ControlItem,
} from './dictionaries.models';

import * as fromActions from './dictionaries.actions';
import * as jsonCountries from '../../../assets/countries.json';

type Action = fromActions.All;

const itemToControlItem = (x: Item): ControlItem => ({
  value: x.id,
  label: x.name,
  icon: x.icon,
});

const addDictionary = (items: Item[]): Dictionary => ({
  items,
  controlItems: [...items].map((x) => itemToControlItem(x)),
});

@Injectable()
export class DictionariesEffects {
  rolesRef!: any;
  specializationsRef!: any;
  qualificationsRef!: any;
  skillsRef!: any;

  constructor(private actions: Actions, private db: Firestore) {
    this.rolesRef = collection(this.db, 'roles');

    this.specializationsRef = collection(this.db, 'specializations');
    this.qualificationsRef = collection(this.db, 'qualifications');
    this.skillsRef = collection(this.db, 'skills');
  }

  read$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.READ),
      switchMap(() => {
        console.log('Action dispatched');
        const roles$ = collectionData(this.rolesRef) as Observable<any>;
        //prettier-ignore
        const specializationsRef$ = collectionData(this.specializationsRef) as Observable<any>;
        //prettier-ignore
        const qualificationsRef$ = collectionData(this.qualificationsRef) as Observable<any>;
        const skillsRef$ = collectionData(this.skillsRef) as Observable<any>;

        return zip(
          roles$.pipe(
            tap(() => console.log('go!')),
            take(1)
          ),
          specializationsRef$.pipe(take(1)),
          qualificationsRef$.pipe(take(1)),
          skillsRef$.pipe(take(1)),
          of(
            (jsonCountries as any).default.map((country: any) => ({
              id: country.code.toUpperCase(),
              name: country.name,
              icon: {
                src: null,
                cssClass: 'fflag fflag-' + country.code.toUpperCase(),
              },
            }))
          )
        ).pipe(
          map(([roles, specializations, qualifications, skills, countries]) => {
            console.log('Inside zip');
            const dictionaries: any = {
              roles: addDictionary(roles as Item[]),
              specializations: addDictionary(specializations as Item[]),
              qualifications: addDictionary(qualifications as Item[]),
              skills: addDictionary(skills as Item[]),
              countries: addDictionary(countries),
            };

            const data = new fromActions.ReadSuccess(dictionaries);
            console.log(data);

            return new fromActions.ReadSuccess(dictionaries);
          }),
          catchError((err) => of(new fromActions.ReadError(err.message)))
        );
      })
    )
  );
}
