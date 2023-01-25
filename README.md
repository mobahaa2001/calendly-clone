# Installation

Clone the repository

    git clone git@github.com:taha7/calendly-clone.git

Switch to the repo folder

    cd calendly-clone

---

## Install the Backend

---

Switch to the server folder

    cd calendly-server

Install all the dependencies using composer

    composer install

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Generate a new application key

    php artisan key:generate

(**Set the configuration needed in .env**)

Run the database migrations

    php artisan migrate

Start the local development server

    php artisan serve

**TL;DR command list**

    git clone git@github.com:taha7/calendly-clone.git
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate
    php artisan serve

## Environment variables

- `.env` - Environment variables can be set in this file

---

## Install the frontend

---

Switch to the client folder

    cd calendly-client

Install dependencies

    npm install

(**Set the configuration needed in .env.local**)
You can now access the server at http://localhost:3000
