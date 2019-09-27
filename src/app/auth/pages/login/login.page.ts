import { AuthProvider } from './../../../core/services/auth.types';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authForm: FormGroup;
  authProviders = AuthProvider;
  configs = {
    isSignIn: true,
    action: 'Login',
    actionChange: 'Criar conta'

  };

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);


  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {


    this.createForm();
  }

  createForm() {

    this.authForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]

    });


  }

  get nome(): FormControl {

    // return <FormControl>this.authForm.get('nome');
    return this.authForm.get('nome') as FormControl;

  }

  get email(): FormControl {

    // return <FormControl>this.authForm.get('email');
    return this.authForm.get('email') as FormControl;

  }

  get senha(): FormControl {

    // return <FormControl>this.authForm.get('senha');
    return this.authForm.get('senha') as FormControl;

  }

  changAuthAction(): void {

    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Login' : 'Criar conta';
    this.configs.actionChange = isSignIn ? 'Criar conta' : 'Já existe uma conta';
    !isSignIn
      ? this.authForm.addControl('nome', this.nameControl)
      : this.authForm.removeControl('nome');
  }

  async onSubmit(provider: AuthProvider): Promise<void> {

    console.log(AuthProvider.Email);

    try {

      const credentials = await this.authService.authenticate({
        isSignIn: this.configs.isSignIn,
        user: this.authForm.value,
        provider
      });

      console.log('Autenticado', credentials);
      console.log('Redirecionar: ');

    } catch (e) {

      console.log('Error: ', e);
    }


  }

}
