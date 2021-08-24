# Transactions API

### Prerequisites

To package and run this application, you'll need to:

- Clone this repository:

      $ git clone https://github.com/habitat-sh/sample-node-app.git
      $ cd transactions-api

- [Install Docker](https://www.docker.com/community-edition) (if you're on Mac or Windows) - Optional

### Database Setup

You are required to set up the database before running the application - in order to ensure that the app can connect to a running instance of the database.

To set up the PostgreSQL db on your local machine, you will need to install 'psql' using the following link https://blog.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/

Run the following commands to create the database and the database user

    $ sudo -u postgres psql

- The above command gets you the psql command line interface in full admin mode

    $ create database mydb;

    $ create user myuser with encrypted password 'mypass';
    
    $ grant all privileges on database mydb to myuser;

Alternatively, you can install pgAdmin4 - which is the latest GUI for postgres. Using pgAdmin you can create the database directly.

- Set up databases 'postgres' and 'postgres-test' for the application to connect to. You can use the env variables in '.env.example' for the databse credentials you can set up and directly copy '.env.example' to '.env' to set up the environment variables.

### Running the Application

You can then run the application on your local machine by navigating to the folder with the cloned repository and running the following command

    $ npm run start

Alternatively you can run the application in development mode using the command:

    $ npm run dev
