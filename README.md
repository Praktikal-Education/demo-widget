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
Content-type `application/json`

### Add image

Url: `${urlBase}/api/widget/v1/image/add?token=${token}`
Method: `POST`
Body: `{file: File}`
Content-type `multipart/form-data`
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
