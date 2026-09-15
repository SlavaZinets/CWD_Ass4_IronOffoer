# Iron Offer

Iron Offer is a classic/used car marketplace website built with Astro and
React. Visitors can browse a catalog of cars, filter it, open a detailed page
per car, and — after signing up — save cars to a personal list of favorites.

## Features

- **Catalog** (`/`) — grid of cars (title, price, origin, mileage, wheel
  side, transmission, color, photo) sourced from a static data set
  (`src/data/cars.js`).
- **Filtering** — a filter bar to narrow the catalog by price range,
  mileage range, steering wheel side (left/right), and country of origin
  (Germany, USA, Japan, Italy).
- **Car detail page** (`/cars/[id]`) — a statically generated page per car
  with a larger image, full specs, and description.
- **Accounts** — sign up (`/signUp`) and sign in (`/signIn`) forms that
  validate input client-side and check credentials against accounts stored
  in a hosted mock backend ([mockapi.io](https://mockapi.io)); the logged-in
  account is kept in `sessionStorage` and in a shared `nanostores` store.
- **Favorites** — a like button on each car that adds/removes the car from
  the signed-in account's `likedCars` list, persisted back to the mock API.
- **Account page** (`/account`) — shows the signed-in user's info and liked
  cars.
- **Static content pages** — `/aboutUs`, `/aboutDevs`, `/contactUs`.

## Tech stack

- [Astro](https://astro.build/) for routing, static page generation, and
  layouts (`.astro` components/pages).
- [React](https://react.dev/) for the interactive parts (catalog, filter
  bar, like button, sign in/up forms, account page), loaded as Astro
  islands via `@astrojs/react`.
- [nanostores](https://github.com/nanostores/nanostores) (`@nanostores/react`)
  for shared client-side state (filtered car list, logged-in account).
- Plain CSS per component/page (no CSS framework).
- A [mockapi.io](https://mockapi.io) REST endpoint as a mock backend for
  account storage.

## Project structure

```
src/
  components/   Astro + React UI components (Catalog, FilterBar, ProductCard,
                DetailedProductCard, SignIn, SignUp, Account, LikeButton, ...)
  data/         cars.js — the static car catalog
  layouts/      DefaultLayout, CatalogLayout
  pages/        route files, including the dynamic src/pages/cars/[id].astro
  services/     mockApiService.js — calls to the mock accounts API
  stores/       mainStore.js — nanostores atoms for shared state
  styles/       per-page/per-component CSS
```

## Running locally

Requires Node.js.

```bash
npm install
npm run dev       # start the dev server at http://localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview the production build locally
```
