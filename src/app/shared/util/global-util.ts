import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})

export class GlobalUtil {

  private mobileWidth: number = 750

  isMobile() {
    const window = screen.availWidth
    return window < this.mobileWidth
  }

}
