import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * VisibilityService
 *
 * An Angular service that utilizes RxJS Observables to publish events for the browsers visibility API.
 * This service abstracts the differences between browsers and makes using the visibility API seamless.
 *
 * The service exposes a single method `onVisibilityChange()` that will return an `Observable<Boolean>` that the
 * caller can subscribe to. Since the internal representation of the `Observable` is a `BehaviorSubject`, upon each
 * subscription the subscribe handler will be called immediately with the current value of the visibility observable.
 */
@Injectable()
export class VisibilityService {
  private document: any;
  private hiddenProperty: string;
  private visibilityChangeEvent: string;
  private visibility$: BehaviorSubject<Boolean>;

  private legacyVisibilityHandleFn: (this: Window, ev: FocusEvent) => any;

  constructor() {
    this.document = <any> document;
    this.legacyVisibilityHandleFn = this.legacyVisibilityHandler.bind(this);
    this.initializeVisibilityParameters();
  }

  /**
   * Generates the Observable<Boolean> that callers can subscribe to for visibility events. The subscription value
   * is a {Boolean} value that indicates whether the current window IS VISIBLE.
   *
   * @return {Observable<Boolean>}
   */
  onVisibilityChange(): Observable<Boolean> {
    if (!this.visibility$) {
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
      //This is a legacy browser and does not have support for the visibility api
      this.visibility$ = new BehaviorSubject<Boolean>(this.document.hasFocus());

      //Setup blur and focus event handlers for updating browser visibility.
      window.onblur = this.legacyVisibilityHandleFn;
      window.onfocus = this.legacyVisibilityHandleFn;
    } else {
      this.visibility$ = new BehaviorSubject<Boolean>(!this.document[this.hiddenProperty]);

      this.document.addEventListener(this.visibilityChangeEvent, () => {
        this.visibility$.next(!this.document[this.hiddenProperty]);
      });
    }
  }

  private legacyVisibilityHandler(event: FocusEvent) {
    this.visibility$.next(event.type === 'focus');
  }
}