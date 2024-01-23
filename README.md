# stusome - a social media app for students

> Access our website [here](https://stusome-v2.vercel.app)

stusome is a social media app dedicated for students who want a social media without distractions. It aims to use latest AI model to create a positive ecosystem.

## How to access

In order to be a part of stusome community, you need to sign-up. This will create an account for posting, asking doubts and chats.

## Sections in app

The various sections available are :-

1. Posts
2. Doubts
3. Chats

### Posts Section

Every person can create posts related to academics or general topics related to students. One can also post personal achievements.

<!-- All followers will see the posts in their main feed, but they might also be visible to others in their discover page. -->

Post follow discussions where people can engage and develop the post further. These discussions can further be replied.

### Doubts Section

Students can ask common doubts and also answer to others doubts. <!-- AI model will ensure that respect is maintained. -->

### Chats Section

This allows one to one interaction so that not all discussions are public. <!-- AI will be used to prevent spam and strict authorization will ensure that only reliable people chat. -->
Only authorized people are able to access the chat, this reduces chances of spam.

## Features

### Authorization

The authorization has been implemented using OAuth 2.0. NextAuth has been used as the backend for this. Google, GitHub and Discord APIs allow making applications which allow only authorized users. Furthermore, they help in ensuring a better User Experience by taking away the hassle of creating and remembering passwords.

### Posts and Doubts

The posts and doubts create two major sections of our app. They use MongoDB as database and backend because it offers fast and cheap database with self-hosted server. This nicely lines up with the concept of NextJS based on serverless backend.

In order to ensure faster speeds, asynchronous nature of JavaScript has been utilized. Still, at some parts, data fetching does get slow. Therefore, many external nodeJS modules have been used for better loading states.

Unsplash images have been supported in posts which give a better feeling to the reader. Smooth scroll, automatic heading parser and mandatory relevant tags specification have only acted as a cherry on the top.

The most versatile part of posts and doubts is the markdown input which allows GitHub Flavored Markdown. It allows external links, images, tables, equations, code blocks, blockquote, basic text formatting etc. Syntax highlighting for codes and Latex editing for equations helps to create professional level content.

### Chats

Some people do not feel comfortable to open up publically, and they might prefer to talk with the author directly. Specifically for this feature, chats have also been implemented. It is certainly one of the key highlights for out app but not the core feature for which it was built. Therefore, we have limited the scope for markdown/images/external links etc. for Chats.

Chats use Upstash Redis database, because of its blazing fast speed and easy data manipulation. It has allowed the chats to be quick and responsive.

Realtime functionality has been implemented using PusherJS due to its excellent support in Web-Sockets. This helps in making the chats real time.

### Some other features

- Dark mode support which gives a better user experience.
- Swiper using SwiperJS, toasts using React-Hot-Toast which give reasonable prompts to the user.
- TailwindCSS and Typescript in codebase which make it more maintainable and developer friendly.
- Static Site Generation wherever possible which gives fast loading speed, better search engine optimization and low processing on client side architecture.

### Future improvements

- Adding AI related features to avoid spam
- More privacy related features to the users
- Providing academic content and quizzes
- Option to report content if found objectionable

### Thanks 💙

This was a team work by [me](https://github.com/Manikya-Sharma), and my friends [Lavya](https://github.com/Lavya-Thapar) and [Nikhil](https://github.com/Nikhil-Sharma-06404).

We would like to thank Geetanjali ma'am for guiding and supporting us throughout the creation of this project.

Last but not the least, we would like to thank all the amazing open source contributors whose codes have helped us in making a major part of this project.

<!-- ## How to start local server for the app

> npm and node must be installed to run npm related commands

If want to start a local server, you can clone this github repository and start a developer server using npm

```bash
git clone https://github.com/Manikya-Sharma/stusome
cd stusome
npm i
npm run dev
```

> Some APIs are called using personal tokens not uploaded on github, use your own tokens instead
 -->
