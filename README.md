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

Create a React production build:

https://vitejs.dev/guide/env-and-mode.html

```bash
# exclude wwwroot from solution (but not individual files)
npm run build
```

### Switch to mariadb

```bash
# remove existing container
docker stop mariadb; docker rm mariadb

# Create and start a new container
#docker run --name mariadb -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_DATABASE=attractions -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_ROOT_HOST='%' -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_ROOT_HOST='%' -e MYSQL_DATABASE=attractions -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_ROOT_HOST='%' -e MYSQL_DATABASE=attractions -e MYSQL_USER=root -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_ROOT_HOST='localhost' -e MYSQL_DATABASE=attractions -e MYSQL_USER=root -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_DATABASE=attractions -e MYSQL_USER=root -e MYSQL_ROOT_PASSWORD=1234 -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=attractions -p 3306:3306 -d mariadb:latest
#docker run --name mariadb -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=attractions -p 3306:3306 -d mariadb:11.3
#docker run --name mariadb -e MYSQL_ROOT_HOST='%' -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=attractions -p 3306:3306 -d mariadb:11.3
docker run --name mariadb --network="host" -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=attractions -p 3306:3306 -d mariadb:11.3 # works w/ python 127 and MySqlConnection localhost

docker exec -it mariadb mariadb --user=root --password=1234 -e "CREATE TABLE attractions.test (id INT PRIMARY KEY AUTO_INCREMENT);"

# Start an existing container
docker start mariadb

docker exec -it mariadb mariadb --user=root --password=1234 -e "CREATE USER 'root'@'172.17.0.1' IDENTIFIED BY 'root'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.17.0.1'; FLUSH PRIVILEGES;"

# docker exec + psql drop database
# https://stackoverflow.com/questions/53974488/how-to-delete-and-recreate-a-postgres-database-using-a-single-docker-command
docker exec -it mariadb mariadb --user=root --password=1234 -e "DROP DATABASE attractions"

# Update the connection string

# Remove the old database and migrations
rm -rf API/bt.db* Persistence/Migrations

# Create new migration
dotnet ef migrations add -p Persistence -s API MariadbInitial
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
