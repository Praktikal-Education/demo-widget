# The widget api

## Parameters

The widget receives the following input through the query params when loaded into an iframe:

- `token`: for authorization purposes and to identify the context the widget is used in, please return;
- `baseUrl`: of the API requests.

## Endpoints

### Set settings

Url: `${urlBase}/api/widget/v1/settings?token=${token}`
Method: `POST`
Body: `JSON.stringify(any)`

### Add image

Url: `${urlBase}/api/widget/v1/image/add?token=${token}`
Method: `POST`
Body: `{file: File}`
Response: `{src: string; height: number; width: number}`

### Get settings

Url: `${urlBase}/api/widget/v1/settings?token=${token}`
Method: `GET`
Response: `any`

### Save answer

Url: `${urlBase}/api/widget/v1/answer?token=${token}`
Method: `POST`
Body: `string`

### Get previous answer

Url: `${urlBase}/api/widget/v1/answer?token=${token}`
Method: `GET`

### Save state

Url: `${urlBase}/api/widget/v1/state?token=${token}`
Method: `POST`
Body: `JSON.stringify(any)`

### Get previous state

Url: `${urlBase}/api/widget/v1/state?token=${token}`
Method: `GET`
Response: `string`

### Get overview of all the students’ states

Url: `${urlBase}/api/widget/v1/overview?token=${token}`
Method: `GET`
Response: `{        
  state?: string;
  isCheckedIn: boolean;
  answer?: string;
  screenName: string;
}[]`
Throws unauthorized exception if not teacher.
Throws bad request error if not in a slideshow context.

The availability of `screenName` might change in the future, depending on our control over the widget.

### Save shared state

Url: `${urlBase}/api/widget/v1/sharedState?token=${token}`
Method: `POST`
Body: `JSON.stringify(any)`
Throws unauthorized exception if not teacher.
Throws bad request error if not in a slideshow context.

### Get shared state

Url: `${urlBase}/api/widget/v1/sharedState?token=${token}`
Method: `GET`
Response: `string`

### Get own role

Url: `${urlBase}/api/widget/v1/ownRole?token=${newToken}`
Method: `GET`
Response: `'teacher' | 'student' | undefined`

Returns `undefined` if not in a slideshow context,
we can’t speak about roles if there are no groups.

### Websockets

Url: `${urlBase.replace("http", "ws")}/api/socket/widget?token=${newToken}`
Message data: `{ event: 'OVERVIEW_CHANGED' | 'SHARED_STATE_CHANGED' }`

## Sizing

We strongly recommend to design and develop the widget, so that it uses the space provided with a `height: 100vh; width: 100vw` layout to avoid any scrollbars.
As of horizontally, we expect the widget to have a responsive layout. However, if it is inevitable, we can fit the height of the iframe to that of the content:

```
window.parent.postMessage({ height: 300, token }: { height: number; token: string }, urlBase);
```

Unless, it doesn’t fit the screen or is in fullscreen view. In those cases we ignore it.
The `height` must be a number, don’t forget to send along the token and to mention the `urlBase`.
