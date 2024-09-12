# Youtube Gemini Chat Chrome extension
A chatbot as a Chrome extension that uses transcripts from a YouTube video for QA regarding the video. The backend uses the Gemini API for the QA.


## Installation and Usage

Clone the repo
```sh
git clone https://github.com/shucoll/youtube-gemini-chat.git
```

### Server Side

```sh
cd server
```

Setup a .env file in root(server/) and add
```sh
GEMINI_API_KEY = your-gemini-api-key
PORT = 4000
```

Install dependencies and run the application
```sh
npm install
npm run dev
```

### Client Side

```sh
cd client
```

Install dependencies and run the application
```sh
npm install
npm start
```


To build the application for the Chrome extension, simply run
```sh
npm build
```
And load it as an extension in chrome

Note that the chrome API used in the client side only works when the app is deployed as a chrome extension. To run the app in development mode check App.js and comment out the code using chrome api.
