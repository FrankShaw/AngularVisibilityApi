# Angular Visibility API

This is an Angular service for interacting with Browser's Visibility API. 
This API is useful when you want to know whether your application is currently being viewed by the user or if the tab/window is in the background.

## Usage

To use this service, the `VisibilityModule` must be imported into your app or dependent module.

```typescript
@NgModule({
  ...
  imports: [
    ...,
    VisibilityModule,
    ...
  ]
})
export class MyModule {}
```

## VisibilityService

The visibility service works in all major browsers. If the browser does not have support for the
visibility API, the service will fallback to a legacy method for determining browser visibility.

The service has a single public method `onVisibilityChange` which returns an `Observable<Boolean>`. When the caller
subscribes to the visibility changes of the `Observable`, the subscribe handler will be called immediately with the current 
value of the browser's visibility. All future changes to the visibility will be published to all subscribing methods.

For more information see the example below.

```typescript
@Component({
  ...
})
export class MyComponent {
  constructor(private visibility: VisibilityService) {}
  
  ...
  
  this.visibility.onVisibliltyChange().subscribe((isVisible) => {
    if (isVisible) {
      //perform actions that need to be done when browser if visible
    } else {
      //perform actions when browser has been hidden
    }
  })
}
```

## Decorators
There is also the option to use provided method decorators to decorate methods that should only be run
based on a certain browser visibility or when the visibility of the browser changes

### @OnVisibilityChange()

Any method decorated with this annotation will be called each time the browser visibility changes. This is very similar
to subscribing to events from the `VisibilityService`, just providing another convenience method for interacting with 
the service. Methods decorated with this annotation should accept one parameter `isVisible` that will be provided to the
decorated method when the visibility change fires.

```typescript
export class MyComponent {
  ...
  
  @OnVisibilityChange()
  visibilityChanged(isVisible: Boolean) {
    if (isVisible) {
      //perform actions that need to be done when browser if visible
    } else {
      //perform actions when browser has been hidden
    }
  }
}
```

### @WhenVisibilityIs(isVisible: Boolean)

Another method for interacting with the `VisibilityService` is to decorate a method with this decorator. The `@WhenVisibilityIs`
decorator takes a boolean value that indicates, based on the provided browser visibility status, whether the decorated
method should be invoked or not.

```typescript
export class MyComponent {
  ...
  @WhenVisibilityIs(true)
  executeOnlyWhenVisible(someArg: string, anotherArg: number) {
    //this method only gets invoked (when called) if the application window is determined to be visible to the user.
  }
  
  @WhenVisibilityIs(false)
  executeOnlyWhenHidden() {
    //this method only gets invoked (when called) if the application window is determined to be hidden to the user.
  }
}
```