import { User, AuthProvider, AuthOptions } from './auth.types';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {

    this.authState$ = this.afAuth.authState;
  }

  // verificar se o usuário está autenticado
  get isAuthenticated(): Observable<boolean> {

    return this.authState$.pipe(map(user => user !== null));
  }

  // Autenticador
  authenticate({ isSignIn, provider, user }: AuthOptions): Promise<auth.UserCredential> {
    let operation: Promise<auth.UserCredential>;

    if (provider !== AuthProvider.Email) {

      operation = this.signInWithPopup(provider);

    } else {

      operation = isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);

    }

    return operation;

  }

  logout(): Promise<void> {

    return this.afAuth.auth.signOut();
  }



  // Login
  private signInWithEmail({ email, senha }: User): Promise<auth.UserCredential> {

    return this.afAuth.auth.signInWithEmailAndPassword(email, senha);

  }

  // Cadastro
  private signUpWithEmail({ nome, email, senha }: User): Promise<auth.UserCredential> {

    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, senha)
      .then(credentials =>
        credentials.user
          .updateProfile({ displayName: nome, photoURL: null })
          .then(() => credentials)
      );
  }

  // Login Facebook
  private signInWithPopup(provider: AuthProvider): Promise<auth.UserCredential> {

    let signInProvider = null;

    switch (provider) {
      case AuthProvider.Facebook:
        signInProvider = new auth.FacebookAuthProvider();
        break;
    }

    return this.afAuth.auth.signInWithPopup(signInProvider);
  }
}
