# Vehicle Data Processor

This Vehicle Data Processor is a robust data handling application built with NestJS, GraphQL, TypeORM, PostgreSQL, Redis, and BullMQ. It is designed to fetch, process, and store vehicle data from an external API and facilitating easy access through GraphQL queries.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- node >= 18
- Properly setup .env file based on .env_sample provided in this repo.

### Installation

Clone the repository:

```bash
git clone https://github.com/mohammadfarooqi/bimm-backend-challenge.git
cd bimm-backend-challenge
```

### Running the Application

#### Dockerized Setup

To run the application using Docker:

```bash
# If you want to run the container for prod, then update the npm script from npm run start:dev to npm run start:prod in Dockerfile

docker compose up
```

#### Local Development

For local development, you can use npm scripts:

```bash
# Install Dependencies
npm install

# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

### Functionality

When the application starts, it spins up a BullMQ batch queue. This queue fetches approximately 11,000 'makes' (as of 2024-07-03) data entries from an external API. Each entry is then processed and added to a 'vehicle type' queue with a concurrency of 20. During processing, the application stores the 'make' and 'vehicle type' data in the database, which is subsequently used for GraphQL queries.

Key operational details:
- If particular job fails it'll be retried 3 times.
- The batch job is scheduled to run at every 12:00AM.
- On start of app, queue is flushed for pending, or in progress jobs, and new immediate batch job is initiated.

### External API Notes

The external API `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/:makeId?format=xml` may return a 4xx (majorly 403) error. For now the app would exponentially retry 3 times on any failure. This process needs to be investigated further and debugged to bring robustness to the retry mechanism.

### Improvements

To enhance the application further, consider the following improvements:

- Integrate Bullboard UI for real-time monitoring and management of batch processing jobs.
- Add better logger package like winston or pino
- Add a cache mechanism for GraphQL so we can pull from cache instead of fetching from db everytime.
- Add more tests for the application.
- Add more robust error handling and retry mechanisms for the external API calls.
- Add rate limiting to prevent abuse and ensure service availablity.
- Add Swagger or GraphiQL for better interface for exploring and testing API Endpoints and documentation.

### Features

Grahphql Playground: http://localhost:8080/graphql

Endpoints
1. Fetch makes

```graphql
Request

makes(page:1, pageSize:10){
  	page
  	pageSize
  	totalItems
  	data {
  	  makeId
  	  makeName
  	  vehicleTypes {
        typeId
        typeName
      }
   }
}

Response

{
  "data": {
    "makes": {
      "page": 2,
      "pageSize": 10,
      "totalItems": 11388,
      "data": [
        {
          "makeId": 458,
          "makeName": "MOONLIGHT CHOPPERS",
          "vehicleTypes": [
            {
              "typeId": 1,
              "typeName": "Motorcycle"
            }
          ]
        },
        ...
      ]
    }
  }
}
```

2. Fetch Vehicle Type by make id.

```graphql

Request
vehicleTypes(makeId: 440) {
  typeId
  typeName
}

Response
{
  "data": {
    "vehicleTypes": [
      {
        "typeId": 2,
        "typeName": "Passenger Car"
      },
      {
        "typeId": 7,
        "typeName": "Multipurpose Passenger Vehicle (MPV)"
      }
    ]
  }
}
```