import { CookieService } from 'ngx-cookie-service';
import { SweetAlert } from './../../util/sweet-alert';
import { LoginService } from './../../services/login.service';
import { Component } from '@angular/core';
import { GlobalUtil } from '../../util/global-util';
import { CookieEnum } from '../../enum/cookie.enum';
import { UsuarioDto } from '../../dto/usuario/usuario.dto';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  isMobile!: boolean;
  menuExpandido!: boolean;

  perfilAtual!: UsuarioDto;

  constructor(
    private util: GlobalUtil,
    private loginService: LoginService,
    private sweetAlert: SweetAlert,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.menuExpandido = false;
    this.isMobile = this.util.isMobile();

    const cookiePerfil = this.cookieService.get(CookieEnum.LOGIN);
    if( cookiePerfil ) {
      this.perfilAtual = JSON.parse(cookiePerfil);
    } else {
      this.perfilAtual = new UsuarioDto;
    }

  }

  mouseEventMenu() {
    setTimeout(() => {
      this.menuExpandido = !this.menuExpandido;
    }, 50);
  }

  logoutApp() {
    this.sweetAlert.confirmation('Deseja realmente sair?', 'warning').then(res => {
      if(res.isConfirmed) {
        this.loginService.logout();
      }

    })
  }

}
