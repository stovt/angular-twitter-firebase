# Twitter - Made with Angular 8 and Firebase

Demo: [https://twitter-8cfba.web.app/](https://twitter-8cfba.web.app/)

## Prerequisites

Works with **Node.js** interpreter version **10.16.0**.

[**Yarn**](https://yarnpkg.com/en/docs/install) or [**NPM**](https://www.npmjs.com/get-npm) package manager must be installed in the system. 

[**Firebase**](https://firebase.com/) account. Free Spark Plan works.

## Installation

After cloning the project, install its dependencies with this command:

```bash
yarn install
```

## Creating a Firebase Project

1. Go to [**Firebase Console**](https://console.firebase.google.com) and create your own project.
2. In the project console go to **Project Settings** and copy firebase project setting to the **src/environments/environments.ts** file.
3. Go to **Database** that is located under project console navigation group and create **Cloud Firestore**.
5. Go to **Authentication** that is also located under project console navigation group and set up **Email/Password**, **Google**, **Facebook** and **GitHub**  sign-in methods.
6. Go to **Storage** that is also located under project console navigation group and set up **Cloud Storage**.
7. Deploy the application by running `firebase deploy`

## Running locally

To run the app for local development use this command:

```bash
yarn start
```
This will start the development server (typically on the `localhost:4200`) which will force browser to reload each time you change the source code.
