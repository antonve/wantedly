# Wantedly Test

## Instructions

1. Set up GO environment (see Go documentation)
2. Set connection string, eg: `export WANTEDLY_DATABASE_CONNECTION_STRING="root:@tcp(127.0.0.1:2020)/wantedly"`
3. Set JWT key, eg: `export WANTEDLY_JWT_KEY="thisIsSuperSecretSoChangeIt"`
4. Import `database.sql`
5. Compile application `go build main.go`
6. Start application `./main`
7. Create a new account or use any of the test accounts. (password for all accounts is `test`)
