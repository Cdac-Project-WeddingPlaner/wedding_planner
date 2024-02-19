#!/bin/bash

# Database credentials
DB_USER="root"
DB_PASSWORD="manager"
DB_NAME="wedding_planner"

# Path to your SQL script
SQL_Create="wedding_planner_create.sql"
SQL_Insert="wedding_planner_Insert.sql"
SQL_View="wedding_planner_view.sql"
SQL_Procedure="wedding_planner_procedure.sql"

# Run the SQL script using mysql
mysql -u $DB_USER -p$DB_PASSWORD -e "DROP DATABASE IF EXISTS $DB_NAME;"
mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $SQL_Create
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $SQL_Insert
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $SQL_View
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < $SQL_Procedure

echo "Database setup complete!"
