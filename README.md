# quickmail
A simple tool to generate temp gmail accounts and get codes for various services.

> [!WARNING]
> You need to get an api key from https://rapidapi.com/johndevz/api/gmailnator (it is free) <br>
> and put it in `.apikey`.

| argument        | info |
|-----------------|------|
| -d / -dontsave  | If provided, it will not save the email to /temp/.quickmail |
| -e / -email     | A custom email. If one is not provided, it will look for the one in /temp/.quickmail |
| -l / -limit     | The limit on how many items to show. If one is not provided, it will default to 1 |
| -i / -important | If provided, it will only show important codes/urls from the supported services. (see below) |

```bash
# to generate the email
bun run .\generate.js

# to see its inboxa
# it will show the latest to oldests
bun run .\inbox.js -e customemail@gmail.com -l 1
```

## Services
1. [Codeberg](https://codeberg.org/)
2. [Telegram](https://telegram.org/)
3. [GitHub](https://github.com/)
