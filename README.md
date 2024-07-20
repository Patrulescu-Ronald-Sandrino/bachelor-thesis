# bachelor-thesis

## Setup

```bash
git init
dotnet new gitignore
echo '# bachelor-thesis' >> README.md
# add this to README.md
git add . && git commit -m "Add README.md and .gitignore"
```

```bash
dotnet new sln
dotnet new webapi -n API --use-controllers
dotnet new classlib -n Application
dotnet new classlib -n Domain
dotnet new classlib -n Persistence

dotnet sln add API/API.csproj
dotnet sln add Application
dotnet sln add Persistence
dotnet sln add Domain

cd API; dotnet add reference ../Application; cd ..
cd Application; dotnet add reference ../Persistence; dotnet add reference ../Domain; cd ..
cd Persistence; dotnet add reference ../Domain; cd ..
```

Run the API:

```bash
dotnet watch run --no-hot-reload --non-interactive
```

## Create an Entity Framework code first migration

```bash
dotnet ef migrations add -p Persistence -s API InitialCreate
# dotnet ef migrations remove # remove the last migration
```

## Create the React application

```bash
npm create vite@latest client -- --template react-ts
```

```bash
cd client
npm install
npm run dev
```

Run the React application:

```bash
npm run dev -- --host --port 4000
```

## Utils

SQLite URL: `jdbc:sqlite:PATH/bt.db`

https://stackoverflow.com/questions/46349038/jetbrains-rider-run-with-watch
(seems like it doesn't work in debug mode)

### Swagger to Postman

1. Import http://localhost:7000/swagger/v1/swagger.json
2. Add `http://localhost:7000` to Collection's Variables
3. Add to `login` endpoint -> Scripts:

```javascript
const user = pm.response.json();

pm.test("Has properties", function () {
    pm.expect(user).to.have.property('token');
});

if (pm.test("Has properties")) {
    pm.collectionVariables.set('bearerToken', user.token);
}

pm.test("Collection variables token has been set", function () {
    var token = pm.collectionVariables.get('bearerToken');
    pm.expect(token).to.eql(user.token);
});
```
