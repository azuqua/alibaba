# ali-baba

Completely open oauth server designed for programmatic testing of oauth flow.

## oauth models

### password

Get token

```bash
curl localhost:4001/oauth/p/token -X POST -d 'username=thomseddon&password=nightworld&grant_type=password&client_id=thom&client_secret=nightworld'
# returns { token_type: 'bearer', access_token: <> ...}
```

Validate token

```bash
curl localhost:4001/p -H 'Authorization: Bearer <access_token>'
```

### client_credentials + refresh_token

Get token

```bash
curl localhost:4001/oauth/ccrt/token -X POST -d 'grant_type=client_credentials&client_id=thom&client_secret=nightworld'
# returns { token_type: 'bearer', access_token: <>, refresh_token: <> ...}
```

Validate token

```bash
curl localhost:4001/ccrt -H 'Authorization: Bearer <access_token>'
```

Refresh token

```bash
curl localhost:4001/oauth/ccrt/token -X POST -d 'grant_type=refresh_token&client_id=thom&client_secret=nightworld&refresh_token=<>'
# returns { token_type: 'bearer', access_token: <>, refresh_token: <> ...}
```

Invalidate access token - this has the effect of expiring the access_token, forcing a subsequent call to trigger a refresh

```bash
curl localhost:4001/oauth/ccrt/token -X DELETE -d 'access_token=<>'
```
