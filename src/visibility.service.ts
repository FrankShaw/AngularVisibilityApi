import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class VisibilityService {
  document: any;
  hiddenProperty: string;
  visibilityChangeEvent: string;
  visibility$: Subject<Boolean>;

  private initialized = false;

  constructor() {
    this.visibility$ = new BehaviorSubject<Boolean>(true);
    this.document = <any> document;
    this.initializeVisibilityParameters();
    this.setupVisibilityHandler()
  }

  onVisibilityChange(): Observable<Boolean> {
    if (!this.initialized) {
      this.setupVisibilityHandler();
    }
    return this.visibility$.asObservable();
  }

  private initializeVisibilityParameters() {
    if (typeof this.document.hidden !== 'undefined') {
      this.hiddenProperty = 'hidden';
      this.visibilityChangeEvent = 'visibilitychange';
    } else if (typeof this.document.mozHidden !== 'undefined') {
      this.hiddenProperty = 'mozHidden';
      this.visibilityChangeEvent = 'mozvisibilitychange';
    } else if (typeof this.document.msHidden !== 'undefined') {
      this.hiddenProperty = 'msHidden';
      this.visibilityChangeEvent = 'msvisibilitychange';
    } else if (typeof this.document.webkitHidden !== 'undefined') {
      this.hiddenProperty = 'webkitHidden';
      this.visibilityChangeEvent = 'webkitvisibilitychange';
    }
  }

  private setupVisibilityHandler() {
    if (typeof this.document.addEventListener === 'undefined' ||
        typeof this.document[this.hiddenProperty] === 'undefined') {
      //legacy handler setup
    } else {
      this.document.addEventListener(this.visibilityChangeEvent, () => {
        this.visibility$.next(this.document[this.hiddenProperty]);
      });
    }
  }
}