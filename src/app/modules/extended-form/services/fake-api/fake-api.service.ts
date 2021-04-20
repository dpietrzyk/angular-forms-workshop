import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class FakeApiService {
  private registeredNames = [
    'damian',
  ];

  isAllowedName(name: string): Observable<boolean> {
    return of(!this.registeredNames.includes(name)).pipe(delay(2000));
  }

}
