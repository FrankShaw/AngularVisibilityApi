import { Injector, StaticProvider } from '@angular/core';
import { VisibilityService } from './visibility.service';

const injector = Injector.create({
  providers: <StaticProvider[]> [{provide: VisibilityService, deps: []}]
});
const visibility: VisibilityService = injector.get<VisibilityService>(VisibilityService);

/**
 * A TypeScript method decorator that will call the annotated method each time the browser visibility is updated.
 * The method should accept a single parameter which will correspond the current browser visibility.
 *
 * Each annotated method will be called immediately at runtime.
 *
 * @return {(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => void}
 * @constructor
 */
export function OnVisibilityChange() {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): void {
    visibility.onVisibilityChange().subscribe(visibility => {
      descriptor.value.apply(this, [visibility]);
    });
  }
}

/**
 * A TypeScript method decorator that will allow the annotated method to only be called if the browser visibility is
 * equal to the specified configuration value upon invocation of the method.
 *
 * Usage:
 *
 * ```
 * @WhenVisibilityIs(true)
 * onlyCallWhenVisible() {
 *   ...
 *   //implementation of method that should only be called if the user is
 *   //currently interacting with the application's browser window
 * }
 * ```
 *
 * @param {boolean} specifiedVisibility
 * @return {(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => any}
 * @constructor
 */
export function WhenVisibilityIs(specifiedVisibility: boolean) {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    const method = descriptor.value;
    descriptor.value = function () {
      const _this = this;
      const _arguments = arguments;
      visibility.onVisibilityChange().subscribe(isVisible => {
        if (isVisible === specifiedVisibility) {
          method.apply(_this, _arguments);
        }
      }).unsubscribe();
    };
  }
}