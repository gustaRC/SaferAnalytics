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

}
