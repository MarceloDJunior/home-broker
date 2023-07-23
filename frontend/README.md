# Home Broker Frontend

The frontend part of the Home Broker project, which is built using Next.js 13. The frontend consumes the backend NestJS REST API and subscribes to server-sent events for real-time updates.

## Technologies Used

- **Next.js 13**: The frontend is built with Next.js 13, leveraging its latest features, including Server Components and the new Next router.
- **SWR**: Used to handle requests and improve performance. SWR first gets the data from cache, then makes the actual request and revalidates.
- **SWR Subscriptions**: Used to subscribe for server-sent events.
- **Tailwind CSS**: Used for styling the application.
- **Flowbite Components**: Used for creating reusable components.
- **JSON Server**: Used to simulate a backend.
- **Lightweight Charts**: Used to create the assets chart.
- **Server Actions and Revalidation Tags**: Used to manage server-side actions and control data revalidation.
- **Next.js API**: Used to improve caching and hide the actual API endpoints. Also used to create a different cache revalidation strategy based on the current time (revalidates more often when the stock is open).

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository
2. Make sure you have Node.js and npm installed on your machine.
3. Install dependencies using `npm install`.
4. Run the frontend using `npm run dev`.

## References

- [Next.js](https://nextjs.org/)
- [SWR](https://swr.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Flowbite](https://flowbite.com/)
- [JSON Server](https://github.com/typicode/json-server)
- [Lightweight Charts](https://github.com/tradingview/lightweight-charts)