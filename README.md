## Init

### Tokens

To configure, create file ``./.secrets.js``:
```
var SENDINBLUE_APIKEY = "XXXXX";

```

### Clasp

Example ``.clasp.json``:
```
{
  "scriptId": "",
  "rootDir": "build/",
  "projectId": "project-id-xxxxxxxxxxxxxxxxxxx",
  "fileExtension": "ts",
  "filePushOrder": ["file1.ts", "file2.ts"]
}
```
Read more: [https://github.com/google/clasp](https://github.com/google/clasp)

## Build & Deploy

```
npm run webpack
clasp push
```


## Triggers

triggerSendConfirmation
	v

