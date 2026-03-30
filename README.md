# Warsztat programowania zespołowego

## phase 0 TODO:

- [x] create working alpha version (repo structure, first controller, dockerfiles) - AP
- [x] add shared structures - AP
- [x] setup github actions lint and typecheck - AP
- [x] setup precommit hooks with husky and lint-staged - AP
- [x] write a semi-decent readme with setup instructions - AP
- [ ] setup database and add connection to it - MK
- [ ] clear not needed templates code - AP
- [x] meeting with intro on how the structure works - AP&MK

## How to run:

You need Docker installed. To run without it see below. With docker installed, use the provided docker-compose file. Go to root folder and use
`docker-compose up -d`
Application frontend started on port **3000** and backend on port **5000**

You can also run locally but the app assumes docker-network, so without it backend won't recognise fronted. If you want to run without docker, you have to change the address (from ex. http://backend to localhost).

## Technologies:

Backend runs on **Express.js** with **TypeScript**. Tests are run using Vitest, linting done with Prettier and Husky for pre-commit hooks. Setup is very similar to [what can be found here](https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d)

Frontend was setup with **Vite**. It uses **React** and **Typescript**.

Database setup on **Supabase** [details to be added].

Backend and fronted can be started together using this [docker compose file](docker-compose.yml)

## Best practices:

Main branch is protected, you can't merge directly to it. To merge you need to create a pull request and pass CI flow. Ideally name branches "feature/what-you-are-working-on".

There are some pre-commit hooks set. You can inspect them in [husky file](/.husky/pre-commit). These run everytime you attempt to commit. They do not actually modify your code, just inform you of certain issues (failing test, missing type or formatting). The same checks will run on pull request, so you won't be able to merge without fixing those anyway.

You can find all the commands [here](package.json) but most important ones

- to fix formatting run `npm run format`
- to run tests run `npm run test:run`

## Team members:

- Aleksander Pugowski
- Maria Tyrpa
- Bartosz Polak 
- Błażej Torbus
- Dawid Kryński
- Eryk Stępień,
- Oliwia Majewska
- Piotr Makoś
- Maciej Kijowski
