import mariadb
import sys

# Connect to MariaDB Platform
try:
    connection = mariadb.connect(
        user = "root",
        password = "1234",
        host = "127.0.0.1",
        port = 3306,
        database = "attractions"
    )
    
    # Get Cursor
    cursor = connection.cursor()

except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

print(cursor)
