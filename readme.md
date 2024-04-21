# vite-size-action

Use GitHub Actions to get a comment on your PR's with tables showing information about the bundle size of your current against your base branch. Vite Size Action uses Vite's JavaScript API to build and calculate the bundle size of the output build of your project.

> [!NOTE]
> This project is very early and was initially built for a specific library, a lot of improvements and features can be potentially added. Feel free to collab. Thanks! <3

## Configuration

Setup a global script called `size` following [vite-size configuration steps](https://github.com/glitch-txs/vite-size?tab=readme-ov-file#vite-size)

## workflow

````yml
on:
  pull_request:
    branches:
      - main

jobs:
  vite_size:
    runs-on: ubuntu-latest
    name: Run Vite Size
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - name: Running vite-size script
        uses: glitch-txs/vite-size-action@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
