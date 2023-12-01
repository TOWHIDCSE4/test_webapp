# ISPEAK

## Prerequisites

You will need [Node.js](https://nodejs.org) version 8.0 or greater installed on your system.

## Setup

Get the code by either cloning this repository using git

```
git clone https://github.com/ispeakvn/ispeak-webapp.git


Once downloaded, open the terminal in the project directory, and install dependencies with:

```
npm install
```

Copy file .env to .env.local. Change the following lines:

```
  NEXT_PUBLIC_API: https://api-dev.englishplus.vn/api/v1
  NEXT_PUBLIC_SOCKET_API: https://api-dev.englishplus.vn
```

Then start the example app with:

```
npm run dev
```

If you want build without hot reload and you is running server in your local:

```
npm run build:local
```
```
npm run start:local
```
The app should now be up and running at http://localhost:3000 🚀
