# Live Link [Vercel](https://shelf-assignment.vercel.app/)

# Setup instructions

## Server
1. Change directory to server using `cd server`
2. Install npm packages using `npm install`
3. Please ensure ts-node is installed in your system
4. Then, run `ts-node server.ts` to start the server

## Client
1. Change directory to client using `cd client`
2. Install npm packages using `npm install`
3. Then, run `npm run dev` to run the nextjs development server

 
# What’s working 
- Book owners can list new books, toggle their availability, and even delete them
- Book seekers can view the listings and search through them
- Contact information of the owner is visible in the listing
- Mock auth with register and login endpoints is working
- Redirects work as intended, seekers are redirected to `/seeker` and owners to `/owner`

# What’s not working
- The nav bar does not update upon successful login, however, this can be easily fixed.
- Render marks the project as inactive if there is no activity, this is not something I can fix or control, if the backend seems unresponsive, this is the reason.
- Right now, there is a single endpoint to fetch all books, the owner dashboard fetches all books and filters them using ownerId, this is not optimal, but it works.

# Bonus features
- Edit/delete your own book listings
- Filter listings by Genre/Location (Can use the search option)
- Deploy frontend + backend: [Frontend on Vercel](https://shelf-assignment.vercel.app/) + [Backend on Render](https://shelf-assignment-usfy.onrender.com)
- AI tools used: Claude, ChatGPT, Github Copilot, DeepSeek

