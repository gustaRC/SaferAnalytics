import { Injectable } from '@angular/core';
import { RequisicaoPadraoService } from './requisicao-padrao.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../interfaces/usuario/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends RequisicaoPadraoService{

  private linkUsarios = this.getEndpoint('usuarios');

  constructor(
    private http: HttpClient,
  ) {
    super();
  }

  getListaUsuarios(): Observable<UsuarioInterface[]> {
    return this.http.get<UsuarioInterface[]>(`${this.linkUsarios}`)
  }

}
