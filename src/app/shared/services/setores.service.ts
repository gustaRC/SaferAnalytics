import { Injectable } from '@angular/core';
import { RequisicaoPadraoService } from './requisicao-padrao.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetoresService extends RequisicaoPadraoService{

  private setoresEndpoint = this.getEndpoint('setores');

  constructor(
    private http: HttpClient
  ) {
    super()
  }

  getSetores(): Observable<any> {
    return this.http.get<any>(this.setoresEndpoint)
  }


}
