# Personal Portfolio

A modern, interactive personal portfolio website built with React, Vite, and Framer Motion. This portfolio showcases my projects, skills, and provides a seamless way to get in touch.

## Features

- **Interactive UI**: Smooth animations and page transitions using `framer-motion`.
- **Contact Form**: Integrated with EmailJS for direct communication.
- **AI Integration**: Powered by Google GenAI for smart interactions.
- **Responsive Design**: Fully responsive layout that looks great on all devices.

## Manual Deployment

To deploy your portfolio manually, follow these steps:

1.  **Build the project**: Run `npm run build` in your terminal. This will create a `dist/` folder.
2.  **Upload to a host**: Upload the `dist/` folder to a service like [Netlify](https://app.netlify.com/drop) or [Vercel](https://vercel.com/new).

For detailed instructions and environment variable setup, see the [Manual Deployment Guide](manual_deployment_guide.md).

## Prerequisites
- Node.js installed.
- **GEMINI_API_KEY**: Set this in `.env.local` before building if you want the AI features to work.
