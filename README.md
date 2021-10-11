<div align="center">
  <a href="https://github.com/flolu/auth">
    <img width="100px" height="auto" src="./.github/check.png" />
  </a>
  <br>
  <h1>Integration Testing</h1>
  <p>Example for Easy and Effective Integration Testing with Node.js and Testcontainers</p>
  <!-- <a href="https://youtu.be/XXX">
    <img width="320px" height="180px" src="https://img.youtube.com/vi/XXX/mqdefault.jpg" style="border-radius: 1rem;" />
    <p>Watch the YouTube Tutorial</p>
  </a> -->
</div>

# Usage

**Recommended OS**: Ubuntu 20.04 LTS

**Requirements**: Yarn, Node.js

**Optional**: Docker, Docker Compose

**Setup**

- `yarn install`

**Development**

- `make dev` or `yarn dev` (Start development backend services, http://localhost:3000)
- `make test` or `yarn test` (Run integration tests)
- `<F5>` (Start test for current file, you can also set debug breakpoints)

# Codebase

- [`index.ts`](index.ts) entry point to a simple todo management Node.js API
- [`index.test.ts`](index.test.ts) entry point to integration testing the todo API
- [`docker-compose.yml`](docker-compose.yml) to start the backend for development
- [`workflows/test.yml`](.github/workflows/test.yml) to run integrations test on every push with GitHub Actions

# Credits

<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
