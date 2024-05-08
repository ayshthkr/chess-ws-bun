
# Chess (Using Websocket server)

This is a chess game that uses a websocket server on the client and react-chessboard package on the client.


## Run Locally

Clone the project

```bash
  git clone https://github.com/ayshthkr/chess-ws-bun
```

Go to the project directory

```bash
  cd server
```

Install dependencies

```bash
  bun install
```

Start the server

```bash
  bun run index.ts
```

Start the client in a seperate process
```bash
  cd client && bun i && bun run dev
```

Visit ```http://localhost:5173``` to see the game in action.


## Screenshots

![App GIF](https://raw.githubusercontent.com/ayshthkr/chess-ws-bun/master/client/public/game.gif)


## Tech Stack

**Client:** React (With Vite), [React Chessboard](https://github.com/Clariity/react-chessboard#readme)

**Server:** [Bun](https://bun.sh)


## Authors

- [@ayshthkr](https://www.github.com/ayshthkr)

