// client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  IconButton,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        context: updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.text,
        })),
      });
      setMessages([...updatedMessages, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', text: 'Failed to get a response from the bot.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">🌍 Travel Planner AI</Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 2,
          bgcolor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((msg, i) => (
          <Paper
            key={i}
            elevation={2}
            sx={{
              padding: 1.5,
              maxWidth: '75%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: msg.role === 'user' ? '#1976d2' : '#eeeeee',
              color: msg.role === 'user' ? 'white' : 'black',
              borderRadius: 2,
            }}
          >
            <Typography>{msg.text}</Typography>
          </Paper>
        ))}
        {loading && (
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>Typing...</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #ddd' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about your next trip..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
}

export default App;
