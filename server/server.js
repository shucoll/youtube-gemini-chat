import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import {GoogleGenerativeAI} from '@google/generative-ai';

import { YoutubeTranscript } from 'youtube-transcript';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store contexts for each client
const clientsContext = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  let clientContext = {};

  // Listen for context setting from client
  socket.on('setContext', async (videoId) => {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);

      let transcript_combined = transcript.map((item) => {
        return item.text;
      });

      transcript_combined = transcript_combined.join(' ');
      transcript_combined = transcript_combined.replaceAll('&amp;#39;', "'");
      transcript_combined = transcript_combined.replaceAll('[Music]', '');
      transcript_combined = transcript_combined.replaceAll('[Applause]', '');

      const prompt = `This a the transcript of a youtube video. Based on this transcript give a small summary of what the video is about and what is happening in the video: ${transcript_combined}. Give the summary in a single paragraph. The further questions I ask should be answered with this transcript as context.`;

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const chat = model.startChat();

      const response = await chat.sendMessage(prompt);

      clientContext = { context: transcript_combined, chat: chat };

      clientsContext.set(socket.id, clientContext);

      socket.emit('contextSet', response);

      console.log(`Context set for client ${socket.id}`);
    } catch(error) {
      console.error('Error :', error);
      socket.emit('error', 'An error occurred');
    }
  });

  // Listen for questions from client
  socket.on('askQuestion', async (question) => {
    clientContext = clientsContext.get(socket.id); // Retrieve the context for the client

    if (!clientContext) {
      socket.emit('error', 'No context set yet. Please set the context first.');
      return;
    }

    const prompt = `Answer me this question in a single paragraph: ${question}`;

    try {
      const response = await clientContext.chat.sendMessage(prompt);

      socket.emit('response', response); 

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      socket.emit('error', 'Failed to get response from the Gemini API.');
    }
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    clientsContext.delete(socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
