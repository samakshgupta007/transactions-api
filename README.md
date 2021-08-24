# Transactions API

### Prerequisites

To package and run this application, you'll need to:

- Clone this repository:

      $ git clone https://github.com/samakshgupta007/transactions-api.git
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

The API is available at the endpoint

    $ /api/v1/transactions/:userId?from={some_date_iso_string}&to=${another_date_iso_string}

Calling this endpoint - either on localhost:PORT or using the docker IP address will give you an array of objects of the type:

[{
"display_name": "Merchant Name",
"user_id": "userId",
"Percentile": 0.5 (Floating point number - which needs to multiplied by 100 to get the percentile value)
}]

Or it will return an error due to bad data or unavailable service.


### Scalability & Resource Consumption

- We will create indices in the 'user_id' (Hash Index) and 'merchant_id' (B-tree Index) and 'date' (B-tree Index) fields in the 'transactions' table. This will help in faster retrieval of the data from the designed API. 

- Moreover, we can run cron jobs to summarize the data every night and store that summarized data into a summary table. For example, we can update the total spend of each user on each merchant and keep that data in a different table. With indices on the columns of the summary table - our query speed would improve and improve scalability, providing a performance advantage. We might take a small hit in accuracy in this case - however, if the data set is large, then the results would be relatively accurate with maybe 1-2% offsets at the maximum.

- We can also store the 'display_name' of the merchant in the 'transactions' table and avoid the LEFT OUTER JOIN operation in the query. 

Postgres offers partitioning DDL. So you can easily create partitions for every week/month.

- Query performance can be improved dramatically in certain situations, particularly when most of the heavily accessed rows of the table are in a single partition or a small number of partitions. The partitioning substitutes for leading columns of indexes, reducing index size and making it more likely that the heavily-used parts of the indexes fit in memory.

- When queries or updates access a large percentage of a single partition, performance can be improved by taking advantage of sequential scan of that partition instead of using an index and random access reads scattered across the whole table.


In order to scale the application we can use a few other techniques:

- Distributed, in-memory, scale-out architecture: query performance improves significantly when the underlying database can run SQL on very large data sets that have been distributed and stored in RAM across multiple computers. This is called data sharding, and it makes it possible for queries to run across multiple computers in parallel.

- GPU parallel processing architecture: query performance shifts into an entirely new gear when each computer can also take advantage of the massively parallel compute processing power of GPUs.

- PostgreSQL can devise query plans (parallel query) which can leverage multiple CPUs in order to answer queries faster. For queries that can benefit, the speedup from parallel query is often very significant. Queries that touch a large amount of data but return only a few rows to the user typically benefit most.

- Using a load balancer such as HAProxy or Nginx to distribute the load between multiple servers.

- Sharding the data is key and we would need to ensure that the data is distributed evenly between the shards. We can dissect aggregation, send partial queries to shards in parallel, perform parallel execution on shards and add up data on main node

- Moreover, the query speed could be improved if we can get the data for a particular merchant instead of returning and array with the percentiles of all the merchants.




