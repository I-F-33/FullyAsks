import mysql.connector as mysql
from mysql.connector import Error
import pandas as pd
import numpy as np

dbuser = 'admin'
dbpassword = 'FullyAsks01'
dbhost = 'fullyasksdb.ctwoq4ouq4kl.us-east-1.rds.amazonaws.com'
dbdatabase = ''
database_name = 'questions'


def create_questions_df():
    """This function will read the .csv with the questions data and create a pandas dataframe and return the dataframe"""
    with open('db/FullyQuestions.csv', 'r') as FQ:
        questions = pd.read_csv(FQ,index_col=False, delimiter=',')
        return questions
    
def drop_database(connection, cursor):
    """This function will drop the database if it exists"""
    if connection.is_connected():
        cursor.execute('DROP DATABASE IF EXISTS questions;')
        print('Database dropped')

        cursor.close()
    else:
        print('Connection to MySQL database failed')


def create_connection():
    """This function will create a connection to the MYSQL AWS database and return the connection object"""
    try:
        connection = mysql.connect(
            user = dbuser,
            password = dbpassword,
            host= dbhost,
            database = dbdatabase
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print("Error while connecting to MySQL", e)
        
    return False


def create_questions_table(connection):
    """This function will create the questions table in the the database and insert the collected data from csv into the database
       Schema:
       question_id INT PRIMARY KEY AUTO_INCREMENT, 
       question VARCHAR(255), 
       question_type VARCHAR(255), 
       choice_1 VARCHAR(255), 
       choice_2 VARCHAR(255), 
       choice_3 VARCHAR(255), 
       choice_4 VARCHAR(255), 
       correct_answer VARCHAR(255)
       """
    if connection.is_connected():
        print('Creating questions dataframe')
        questions_df = create_questions_df()

        questions_df = questions_df.replace(np.nan, '')


        print('establishing cursor')
        cursor = connection.cursor()

        print('create database')
        cursor.execute('CREATE DATABASE IF NOT EXISTS questions;')
        
        print('selecting database')
        cursor.execute('USE questions;')

        record = cursor.fetchone()
        print('You are connected to database:', record)

        print('droping table if exists')
        cursor.execute('DROP TABLE IF EXISTS questions;')

        print('Creating table questions')
        cursor.execute('CREATE TABLE questions (question_id INT PRIMARY KEY AUTO_INCREMENT, question VARCHAR(255), question_type VARCHAR(255), choice_1 VARCHAR(255), choice_2 VARCHAR(255), choice_3 VARCHAR(255), choice_4 VARCHAR(255), correct_answer VARCHAR(255));') 

        print('Inserting records into questions table')
        for i, row in questions_df.iterrows():
            sql = "INSERT INTO questions.questions (question, question_type, choice_1, choice_2, choice_3, choice_4, correct_answer) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(sql, tuple(row))
            print('Record inserted')
            connection.commit()

        print('Questions table created and records inserted')
        print('get everything from questions table')
        cursor.execute('SELECT * FROM questions;')
        records = cursor.fetchall()
        print('Printing all records')
        for record in records:
            print(record)

        print('Closing cursor')
        cursor.close()

        print('Closing connection')
        connection.close()
    else:
        print('Connection to MySQL database failed')
    
def select_all_questions(connection):
    """This function will select all the records from the questions table and print it out to the console"""
    if connection.is_connected():
        cursor = connection.cursor(buffered=True)

        print('selecting database')
        cursor.execute('USE questions;')

        print('selecting all records from questions table')
        cursor.execute('SELECT * FROM questions;')

        records = cursor.fetchall()

        print('Printing all records')

        for record in records:
            print(record)

        cursor.close()
    else:
        print('Connection to MySQL database failed')

def create_users_table(connection):
    """This function will create the users table in the database
       Schema:
       user_id INT PRIMARY KEY AUTO_INCREMENT,
       username VARCHAR(255),
       year INT)
       """
    if connection.is_connected():

        cursor = connection.cursor()

        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
            user_id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255),
            year INT
        );"""

        cursor.execute(f"USE {database_name};")

        cursor.execute(create_users_table)
        print('Users table created')
        cursor.close()

        connection.commit()

    else:
        print('Connection to MySQL database failed')

def create_gamerecord_table(connection):
    """This function will create a game record table
       schema:
            game_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            score INT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
       """
    if connection.is_connected():

        game_record_query = """
        CREATE TABLE IF NOT EXISTS game_record (
            game_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            score FLOAT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );"""

        cursor = connection.cursor()

        cursor.execute(f"USE {database_name};")

        cursor.execute(game_record_query)

        print('Game record table created')

        cursor.close()

        connection.commit()
    
    else:

        print('Connection to MySQL database failed')


def check_table_exists(connection, table_name):
    # Create a cursor object to execute SQL queries
    if connection.is_connected():
        cursor = connection.cursor()

        cursor.execute(f"USE {database_name};")

        # Define the SQL query to check if the table exists
        check_table_query = """
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = %s 
            AND table_name = %s
        ) AS table_exists;
        """

        # Execute the SQL query with the database name and table name as parameters
        cursor.execute(check_table_query, (database_name, table_name))

        # Fetch the result of the query
        table_exists = cursor.fetchone()[0]

        # Print the result
        if table_exists:
            print("Table exists.")
        else:
            print("Table does not exist.")

        # Close the cursor and database connection
        cursor.close()
    else:
        print('Connection to MySQL database failed')

    
def close_connection(connection):
    """This function will close the connection to the MYSQL AWS database"""
    if connection.is_connected():
        connection.close()
        print('Connection closed')
    else:
        print('Connection to MySQL database failed')

if __name__ == '__main__':
    connection = create_connection()
    check_table_exists(connection, 'game_record')
    close_connection(connection)


# import mysql.connector as msql 
# from mysql.connector 
# import Error 
# try: conn = mysql.connect(host='localhost', database='employee', user='root', password='root@123') 
# if conn.is_connected(): 
#     cursor = conn.cursor() 
#     cursor.execute("select database();") 
#     record = cursor.fetchone() 
#     print("You're connected to database: ", record) 
#     cursor.execute('DROP TABLE IF EXISTS employee_data;') 
#     print('Creating table....') 
#     # in the below line please pass the create table statement which you want #to create 
#     cursor.execute("CREATE TABLE employee_data(first_name varchar(255),last_name varchar(255),company_name varchar(255),address varchar(255),city varchar(255),county varchar(255),state varchar(255),zip int,phone1 varchar(255),phone2 varchar(255),email varchar(255),web varchar(255))") 
#     print("Table is created....") 
#     #loop through the data frame 
#     for i,row in empdata.iterrows(): 
#         #here %S means string values 
#         sql = "INSERT INTO employee.employee_data VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)" 
#         cursor.execute(sql, tuple(row)) 
#         print("Record inserted") 
#         # the connection is not auto committed by default, so we must commit to save our changes 
#         conn.commit() 
#         except Error as e: print("Error while connecting to MySQL", e)
