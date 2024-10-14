# Fast-Ecommerce-Admin

 Admin for fast-ecommerce

## Admin Panel - README

###  This repository contains the admin panel for managing GattoRosa operations. Built using Svelte, this panel provides administrators with a streamlined interface for handling backend operations such as order management, user administration, and content updates.

## Configuration

To configure the project, add the following environment variable to your **.env** file:

```bash
SERVER_BASE_URL='https://api.exemplo.com'
```

This points to the staging API server, where all API calls made from the admin panel will be directed.

## Features
 - Svelte Framework: Fast and reactive front-end framework.
 - Admin Operations: Manage orders, users, products, and content.
 - API Integration: Communicates with the GattoRosa backend using the provided SERVER_BASE_URL.
 
# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
