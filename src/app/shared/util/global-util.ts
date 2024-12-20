import { CookieService } from 'ngx-cookie-service';
import { Injectable } from "@angular/core"
import { CookieEnum } from '../enum/cookie.enum';

@Injectable({
  providedIn: 'root'
})

export class GlobalUtil {

  constructor(
    private cookieService: CookieService
  ) {}

  private mobileWidth: number = 750

  isMobile() {
    const window = screen.availWidth
    return window < this.mobileWidth
  }

  setCookie(nomeCookie: string, item: any) {
    this.cookieService.set(nomeCookie, JSON.stringify(item))
  }
  getCookie(nomeCookie: string) {
    return this.cookieService.get(nomeCookie)
  }

  getNomeMes(mes: number) {
    return new Date(2024, mes - 1).toLocaleString('pt-BR', {month: 'long'});
  }

  getAnoCurto(ano: number) {
    return ano.toString().slice(-2);
  }

  converterHoraDecimal(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return Number(((h * 60 + m) / 60).toFixed(2));
  }

}
