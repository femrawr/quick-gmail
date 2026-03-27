# thugmail
A Simple tool to generate temp gmail accounts.

> [!WARNING]
> You need to get an api key from https://rapidapi.com/johndevz/api/gmailnator (it is free) <br>
> and put it in `.apikey`.

| argument       | info |
|----------------|------|
| -d / -dontsave | If provided, it will not save the email to /temp/.thugmail |
| -e / -email    | A custom email. If one is not provided, it will look for the one in /temp/.thugmail |
| -l / -limit    | The limit on how many items to show. If one is not provided, it will default to 1 |

```bash
# to generate the email
bun run .\generate.js

# to see its inboxa
# it will show the latest to oldests
bun run .\inbox.js -e customemail@gmail.com -l 1
```
