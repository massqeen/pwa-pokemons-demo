This mini-project was created as a brief demonstration of PWA capabilities for one of my clients, showcasing how PWA technology can enhance the user experience with features such as offline functionality, responsiveness, and smooth performance.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
This is also a Progressive Web App built with [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa). 

Deployed application [link](https://pwa-pokemons-demo.vercel.app/).

Main features include:

    Offline-support with Service Worker using precaching as well as runtime caching (thanks to Workbox)
    
    Manual offline content download functionality

    Online and offline detection 

    Code splitting, including dynamic component imports (using Next)
    
    Route prefetching
    
    Pagination and search with state persistence

Tailwind CSS was used to write styles, including covering both dark and light modes.

## Getting Started
First, set project node version:

```bash
nvm use
```

Install project packages:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
