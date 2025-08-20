import { useState, useEffect } from 'react';
import './App.css';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { purple } from '@mui/material/colors';

// Page states
const PAGES = {
  WELCOME: 0,
  HOW_IT_WORKS: 1,
  GENERATOR: 2,
};

function WelcomePage({ onNext }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: purple[50],
      }}
    >
      <Box sx={{ mb: 3, animation: 'bounce 2s infinite' }}>
        <span role="img" aria-label="email" style={{ fontSize: 80 }}>
          📧
        </span>
      </Box>
      <Typography variant="h3" gutterBottom>
        Welcome to Smart Email Assistant
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Effortlessly generate professional email replies in seconds!
      </Typography>
      <Button variant="contained" size="large" onClick={onNext}>
        Get Started
      </Button>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-20px);}
          }
        `}
      </style>
    </Box>
  );
}

function HowItWorksPage({ onNext }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: purple[100],
      }}
    >
      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', animation: 'fadeIn 1s' }}>
          <span role="img" aria-label="write" style={{ fontSize: 48 }}>
            ✍️
          </span>
          <Typography>Paste your email</Typography>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            animation: 'fadeIn 1s 0.5s',
            animationFillMode: 'forwards',
          }}
        >
          <span role="img" aria-label="magic" style={{ fontSize: 48 }}>
            ✨
          </span>
          <Typography>Choose a tone</Typography>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            animation: 'fadeIn 1s 1s',
            animationFillMode: 'forwards',
          }}
        >
          <span role="img" aria-label="reply" style={{ fontSize: 48 }}>
            📩
          </span>
          <Typography>Get your reply</Typography>
        </Box>
      </Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        How does it work?
      </Typography>
      <Typography sx={{ mb: 4, maxWidth: 400, textAlign: 'center' }}>
        1. Paste the email you want to reply to.<br />
        2. Select the tone you prefer.<br />
        3. Click "Generate Reply" and copy your AI-powered response!
      </Typography>
      <Button variant="contained" size="large" onClick={onNext}>
        Try Now
      </Button>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </Box>
  );
}

function AnimatedPages({ children }) {
  return <Box sx={{ transition: 'all 0.5s', minHeight: '100vh' }}>{children}</Box>;
}

function AppWrapper() {
  const [page, setPage] = useState(PAGES.WELCOME);

  useEffect(() => {
    // You could add auto navigation or keyboard shortcuts here
  }, []);

  return (
    <AnimatedPages>
      {page === PAGES.WELCOME && <WelcomePage onNext={() => setPage(PAGES.HOW_IT_WORKS)} />}
      {page === PAGES.HOW_IT_WORKS && <HowItWorksPage onNext={() => setPage(PAGES.GENERATOR)} />}
      {page === PAGES.GENERATOR && <App />}
    </AnimatedPages>
  );
}

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/email/generate`,
        { emailContent, tone }
      );

      setGeneratedReply(
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      );
    } catch (err) {
      setError('Failed to generate email reply. Please try again');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={generatedReply}
            inputProps={{ readOnly: true }}
          />

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

// ✅ Only one default export
export default AppWrapper;
