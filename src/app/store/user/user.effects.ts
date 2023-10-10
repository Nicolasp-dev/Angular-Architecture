import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Router } from '@angular/router';

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { firestore } from 'firebase/app';

import { Observable, from, of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment.dev';

import { User } from './user.models';

import * as fromActions from './user.actions';

import { NotificationService } from '@app/services';
import { Auth } from '@angular/fire/auth';

type Action = fromActions.All;

@Injectable()
export class UserEffects {
  constructor(
    private actions: Actions,
    private auth: Auth,
    private router: Router,
    private notification: NotificationService
  ) {}

  // @Effect()
  // init: Observable<Action> = this.actions.pipe(
  //   ofType(fromActions.Types.INIT),
  //   switchMap(() => this.afAuth.authState.pipe(take(1))),
  //   switchMap((authState) => {
  //     if (authState) {
  //       return this.afs
  //         .doc<User>(`users/${authState.uid}`)
  //         .valueChanges()
  //         .pipe(
  //           take(1),
  //           map(
  //             (user) =>
  //               new fromActions.InitAuthorized(authState.uid, user || null)
  //           ),
  //           catchError((err) => of(new fromActions.InitError(err.message)))
  //         );
  //     } else {
  //       return of(new fromActions.InitUnauthorized());
  //     }
  //   })
  // );

  // @Effect()
  // signInEmail: Observable<Action> = this.actions.pipe(
  //   ofType(fromActions.Types.SIGN_IN_EMAIL),
  //   map((action: fromActions.SignInEmail) => action.credentials),
  //   switchMap((credentials) =>
  //     from(
  //       this.afAuth.auth.signInWithEmailAndPassword(
  //         credentials.email,
  //         credentials.password
  //       )
  //     ).pipe(
  //       switchMap((signInState) =>
  //         this.afs
  //           .doc<User>(`users/${signInState.user.uid}`)
  //           .valueChanges()
  //           .pipe(
  //             take(1),
  //             tap(() => {
  //               this.router.navigate(['/']);
  //             }),
  //             map(
  //               (user) =>
  //                 new fromActions.SignInEmailSuccess(
  //                   signInState.user.uid,
  //                   user || null
  //                 )
  //             )
  //           )
  //       ),
  //       catchError((err) => {
  //         this.notification.error(err.message);
  //         return of(new fromActions.SignInEmailError(err.message));
  //       })
  //     )
  //   )
  // );

  signUpEmail$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGN_UP_EMAIL),
      map((action: fromActions.SignUpEmail) => action.credentials),
      switchMap((credentials) => {
        const auth = getAuth();
        return from(
          createUserWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
        ).pipe(
          tap(() => {
            sendEmailVerification(auth?.currentUser!!);
            this.router.navigate(['/auth/email-confirm']);
          }),
          map(
            (signUpState) =>
              new fromActions.SignUpEmailSuccess(signUpState.user.uid)
          ),
          catchError((err) => {
            this.notification.error(err.message);
            return of(new fromActions.SignUpEmailError(err.message));
          })
        );
      })
    )
  );

  // @Effect()
  // signOut: Observable<Action> = this.actions.pipe(
  //   ofType(fromActions.Types.SIGN_OUT),
  //   switchMap(() =>
  //     from(this.afAuth.auth.signOut()).pipe(
  //       map(() => new fromActions.SignOutSuccess()),
  //       catchError((err) => of(new fromActions.SignOutError(err.message)))
  //     )
  //   )
  // );
}
