# The widget api

## Parameters

The widget receives the following input through the query params when loaded into an iframe:

- `token`: for authorization purposes and to identify the context the widget is used in, please return;
- `baseUrl`: of the API requests.

## Endpoints

### Set settings

Url: `${urlBase}/api/widget/v1/settings?token=${token}`
Method: `POST`
Body: `{data: any}`
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
