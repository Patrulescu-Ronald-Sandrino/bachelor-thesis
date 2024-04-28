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

## Create an Entity Framework code first migration

```bash
dotnet ef migrations add InitialCreate -p Persistence -s API
```
