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
