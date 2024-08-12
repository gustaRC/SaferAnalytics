import { SweetAlert } from '../../util/sweet-alert';
import { LoginService } from '../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestUsarioInterface } from '../../interfaces/usuario/requestUsuario.interface';
import { map } from 'rxjs';
import { GlobalUtil } from '../../util/global-util';
import { Router } from '@angular/router';
import { CookieEnum } from '../../enum/cookie.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    private loginService : LoginService,
    private sweetAlert: SweetAlert,
    private util: GlobalUtil,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.util.isMobile()
  }

  loginForm = this.formBuilder.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required],
  })

  loginSubmit(): void {
    this.sweetAlert.loader()

    const dataLogin: RequestUsarioInterface = {
      usuario: this.loginForm.value.usuario as string,
      senha: this.loginForm.value.senha as string
    }

    if(this.loginForm && this.loginForm.valid) {

      //SIMULAÇÃO DO QUE VAI ACONTECER NO BACK
      //EM UM CENARIO REAL, SOMENTE FARIAMOS UM POST E RETORNARIA OS DADOS DO USUARIO OU NAO!
      this.loginService.getListaUsuarios()
      .pipe(map(el => el.find(el =>
        (el.usuario === dataLogin.usuario) && (el.senha === dataLogin.senha)
      )))
      .subscribe({
        next: resp => {
          if (resp) {
            this.sweetAlert.sucess(`Bem vindo ${resp.nome}`);
            console.log(resp)
            this.util.setCookie(CookieEnum.LOGIN, resp)
            this.router.navigate(['/dashboard'])
          } else {
            this.sweetAlert.error('Usuário/Senha invalidos!');
          }
        },
        error: err => {
          console.log(err)
          this.sweetAlert.error('Erro: ' + err.message);
        }
      })

    }

  }

  enviarEmailRecuperacao() {
    // https://www.npmjs.com/package/email
    console.log('enviar email')
  }

}
