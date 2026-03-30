# Warsztat programowania zespołowego

## phase 0 TODO:

- [x] create working alpha version (repo structure, first controller, dockerfiles)
- [x] add shared structures
- [x] setup github actions lint and typecheck
- [x] setup precommit hooks with husky and lint-staged
- [ ] write decent readme with setup instructions
- [ ] add database connection
- [ ] clear not needed templates code
- [ ] meeting with intro on how the structure works

## How to run:

You need Docker installed. To run without it see below. With docker installed, use the provided docker-compose file. Go to root folder and use
`docker-compose up -d`
Application frontend started on port **3000** and backend on port **5000**

You can also run locally but the app assumes docker-network, so without it backend won't recognise fronted. If you want to run without docker, you have to change the address (from ex. http://backend to localhost).

## Architecture:

- backend setup [based on this post](https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d)
- frontend setup with [vite](https://vite.dev/)

## Best practices:

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
