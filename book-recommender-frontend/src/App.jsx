import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import BookIcon from '@mui/icons-material/Book';
// import CardMedia from '@mui/material/CardMedia';



const API_BASE = import.meta.env.VITE_API_BASE;

function Recommendation({ recommendation }) {
  if (!recommendation) return null;
  return (
    <Card variant='outlined' sx={{ mt: 3 }}>
      <CardHeader title={`Your Recommendation: 📖 ${recommendation.title} 📖`} />
      <Divider sx={{ mb: 2 }}/>
      <CardContent>
        {/* <Typography variant='h6'>Your Recommendation: 📖 {recommendation.title} 📖</Typography> */}
        <Typography variant='body1'>{recommendation.reason}</Typography>
      </CardContent>
    </Card>
  );
}

function App() {
  const [books, setBooks] = useState();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const setBook = (index, value) =>{
    const newBooks = [...books];
    newBooks[index] = value;
    setBooks(newBooks);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      console.log("User-entered books:", books);
    
      const response = await fetch(`${API_BASE}/book-recommendation`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({books}),
      });
  
      if(!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      const data = await response.json();
      console.log(data);

      setRecommendation(data);
  
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Box sx={{ minHeight: '100vh', padding: 1 }}>
      <CssBaseline />
      <Box display="flex" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 600,
            // bgcolor: '#1e1e1e',
            // color: '#fff'
          }}
        > 
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, letterSpacing: 0.5}}>
            Advait's Book Recommender
          </Typography>
          <Typography variant='subtitle2'  sx={{ mb:2, fontStyle:'italic'}}>
            Tell me what you loved, and I'll tell you what to read next. 
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Typography variant='subtitle1' gutterBottom>
                Enter up to 3 books you've loved:
              </Typography>

              <Autocomplete
                multiple
                freeSolo
                options={[]} // You can later fill this with suggested book titles
                value={books}
                onChange={(event, newValue) => setBooks(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Stack direction="column" spacing={1}>
                      <Chip 
                        icon=<BookIcon/> 
                        key={index} 
                        variant="outlined" 
                        label={option} 
                        {...getTagProps({ index })} />
                    </Stack>
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Enter your books"
                    placeholder="Press Enter after each title"
                  />
                )}
              />
                      
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  backgroundColor: '#4b7bec',
                  '&:hover': {
                    backgroundColor: '#3867d6'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Getting recommendations...' : 'Get Recommendations'}
              </Button>
            </Stack>
          </Box>

          <Recommendation recommendation={recommendation} />


        </Paper>
      </Box>
    </Box>
  )
}

export default App
