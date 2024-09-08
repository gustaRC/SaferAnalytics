import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { RequisicaoPadraoService } from './requisicao-padrao.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDto } from '../dto/usuario/usuario.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends RequisicaoPadraoService{

  private linkUsarios = this.getEndpoint('usuarios');

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private route: Router
  ) {
    super();
  }

  getListaUsuarios(): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(`${this.linkUsarios}`)
  }

  logout() {
    this.cookieService.deleteAll();
    this.route.navigate(['/login'])
  }

}
