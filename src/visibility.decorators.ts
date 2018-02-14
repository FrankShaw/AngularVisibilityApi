import { Injector, StaticProvider } from '@angular/core';
import { VisibilityService } from './visibility.service';

const injector = Injector.create({
  providers: <StaticProvider[]> [{provide: VisibilityService, deps: []}]
});
const visibility: VisibilityService = injector.get<VisibilityService>(VisibilityService);

export function OnVisibilityChange() {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): void {
    visibility.onVisibilityChange().subscribe(visibility => {
      descriptor.value.apply(this, [visibility]);
    });
  }
}

export function WhenVisibilityIs(specifiedVisibility: boolean) {
  return function <MethodFn>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
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