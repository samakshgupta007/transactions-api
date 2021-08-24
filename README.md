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

Runing the following command gets you the psql command line interface in full admin mode

    $ sudo -u postgres psql

Run these commands to create the database and the database user

    $ create database mydb;

    $ create user myuser with encrypted password 'mypass';

    $ grant all privileges on database mydb to myuser;

Alternatively, you can install pgAdmin4 - which is the latest GUI for postgres. Using pgAdmin you can create the database directly.

- Set up databases 'postgres' and 'postgres-test' for the application to connect to. You can use the env variables in '.env.example' for the databse credentials you can set up and directly copy '.env.example' to '.env' to set up the environment variables.

### Running the Application Locally

You can then run the application on your local machine by navigating to the folder with the cloned repository and running the following command

    $ npm run start

Alternatively you can run the application in development mode using the command

    $ npm run dev

Moreover, you can run the tests by entering this command in terminal - in the project folder

    $ npm run test

### Running the Application using Docker

Ensure you have docker and docker-compose installed, if you wish to run the application using docker. Then navigate to the project folder and run the following command in the terminal:

    $ docker-compose up --build -d

- The '-d' command ensures the container are run in the background or in a 'detached' state.

You can view the docker containers with their associated ID, name, status, and port using this command

    $ docker ps -a

Moreover, To see the output of your containers during their execution time, just execute:

    $ docker logs {container}

### Calling the Transactions API

The API is available at the endpoint /api/v1/transactions/:userId?from={some_date_iso_string}&to=${another_date_iso_string}

Calling this endpoint - either on localhost:PORT or using the docker IP address will give you an array of objects of the type:

[{
"display_name": "Merchant Name",
"user_id": "userId",
"Percentile": Floating point number - which needs to multiplied by 100 to get the percentile value
}]

Or it will return an error due to bad data or unavailable service.
