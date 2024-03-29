import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TransService {
  trans: string;
  constructor(
    private translateService: TranslateService,
  ) {

  }

  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }
}
