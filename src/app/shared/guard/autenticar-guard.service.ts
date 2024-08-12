import { Injectable } from '@angular/core';
import { CookieEnum } from '../enum/cookie.enum';
import { Router } from '@angular/router';
import { GlobalUtil } from '../util/global-util';

@Injectable({
  providedIn: 'root'
})
export class AutenticarGuardService {

  constructor(
    private util: GlobalUtil,
    private router: Router
   ) { }

  canActivate() {
    if (this.util.getCookie(CookieEnum.LOGIN)) {
      return true
    } else {
      this.router.navigateByUrl('/login')
      return false
    }
  }
}
