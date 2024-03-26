import mysql.connector as mysql
from mysql.connector import Error
import pandas as pd
import numpy as np

dbuser = 'admin'
dbpassword = 'FullyAsks01'
dbhost = 'fullyasksdb.ctwoq4ouq4kl.us-east-1.rds.amazonaws.com'
dbdatabase = ''

def create_questions_df():
    with open('db/FullyQuestions.csv', 'r') as FQ:
        questions = pd.read_csv(FQ,index_col=False, delimiter=',')
        return questions
    
def drop_database(cursor):
    cursor.execute('DROP DATABASE IF EXISTS questions;')
    print('Database dropped')

def create_database():
    try:

        connection = mysql.connect(
            user = dbuser,
            password = dbpassword,
            host= dbhost,
            database = dbdatabase
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        
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


    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            print('Closing connection')
            connection.close()
    
def select_all_questions():
    try:
        connection = mysql.connect(
            user = dbuser,
            password = dbpassword,
            host= dbhost,
            database = dbdatabase
        )

        if connection.is_connected():
            print("Connected to MySQL database")
        
        cursor = connection.cursor(buffered=True)

        print('selecting database')
        cursor.execute('USE questions;')

        print('selecting all records from questions table')
        cursor.execute('SELECT * FROM questions;')

        records = cursor.fetchall()

        print('Printing all records')

        for record in records:
            print(record)
        
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            print('Closing connection')
            connection.close()
    


if __name__ == '__main__':
    select_all_questions()        



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
