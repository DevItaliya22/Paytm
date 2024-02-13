# Payment System Backend

This is the backend server for a payment system application built with Node.js, Express.js, MongoDB, and Mongoose.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This backend server provides APIs for user authentication, transactions, friend management, and more for a payment system application.

## Features

- User authentication (sign up, login)
- View user details (balance, transactions)
- Transfer money between users
- Credit and debit money from user account
- Update user password
- Add and manage friends
- Send and fulfill money request

## Installation

1. Clone this repository:


2. Install dependencies:


3. Set up MongoDB:

   - Ensure that MongoDB is installed and running locally on port `27017`.
   - Create a database named `paytm`.

4. Start the server:


The server should now be running on port `3000`.

## Usage

Once the server is running, you can use the provided APIs to interact with the payment system application.

## API Endpoints

- **POST /signup**: Create a new user account.
- **POST /login**: Log in with existing user credentials.
- **GET /users**: Retrieve details of all users.
- **GET /transactions**: Retrieve details of all transactions.
- **POST /givemoney**: Transfer money to another user.
- **POST /creditmoney**: Credit money to user account.
- **POST /debitmoney**: Debit money from user account.
- **POST /updatePassword**: Update user password.
- **GET /showpassword**: Retrieve user password (for testing purposes).
- **GET /friends**: Retrieve user's friends list.
- **POST /addfriends**: Add a new friend.
- **GET /sentRequests**: Retrieve sent money requests.
- **GET /requestReceived**: Retrieve received money requests.
- **POST /sendRequest**: Send a money request.
- **POST /fulfillRequest**: Fulfill a money request.

For detailed information about request and response formats, please refer to the source code or API documentation.

## Dependencies

- express
- cors
- jsonwebtoken
- mongoose

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your improvements.

# Payment System Frontend

This is the frontend application for a payment system built with React.js. It interacts with the backend server to provide users with a user-friendly interface for managing transactions, friends, and account details.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This frontend application provides a user interface for interacting with the payment system backend. Users can sign up, log in, view their account details, send and receive money, manage friends, and more.

## Features

- User authentication (sign up, login)
- View account details (balance, transactions)
- Transfer money to other users
- View and manage friends list
- Send and receive money requests

## Installation

1. Clone this repository:


2. Install dependencies:


3. Start the development server:


3. Start the development server:

The application should open in your default web browser at `http://localhost:5173`.

## Usage

Once the application is running, you can navigate through the different pages using the navigation bar. Use the provided forms and buttons to interact with the backend server and perform various actions such as sending money, adding friends, and updating account details.

## Dependencies

- react
- react-dom
- react-router-dom
- axios

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your improvements.

## License

This pr
