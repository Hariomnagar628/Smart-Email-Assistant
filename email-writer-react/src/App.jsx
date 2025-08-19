const API_URL = import.meta.env.VITE_API_URL;
import { useState } from 'react'
import { Box, Container, TextField, Typography, CssBaseline, FormControl, InputLabel, Select, MenuItem, autocompleteClasses, Button, CircularProgress } from '@mui/material'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')



  const handleSubmit = async () =>{

    setLoading(true)
    setError('');
    try{

      const resposne = await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
    
      });

      setGeneratedReply(typeof resposne.data==='string'?resposne.data:JSON.stringify(resposne.data))


    }catch(error){

      setError('Failed to generate email reply. Please try again');
      console.error(error);

    }finally{
      setLoading(false);
    }

  }
  return (
    <>
   
      <CssBaseline />

      <Container maxWidth="md" sx={{ py:6}}>
        
        <Typography 
          variant="h3" 
          component="h1" 
           gutterBottom      
        >   
          Email Reply Generator
        </Typography>

        {/* Input box */}
        <Box>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
        
        />

        <FormControl fullWidth sx={{mb:4,marginTop:2}}>
          <InputLabel>Tone(Optional)</InputLabel>
          <Select value={tone||''}
          label={"Tone(Optional)"}
          onChange={(e)=>setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button variant='contained'
        onClick={handleSubmit}
        disabled={!emailContent|| loading}
        fullWidth>
          {loading?<CircularProgress size={24}/>:"Generate Reply"}
        </Button>
        </Box>

      {error && (

        <Typography color='error' sx={{mb:2}}>   
          {error}
        </Typography>

      )}

           {generatedReply && (<Box sx={{mt:3}}>

               <Typography variant='h6' gutterBottom>
                Generated Reply:
               </Typography>
               <TextField fullWidth
               multiline
               rows={6}
               variant='outlined'
               value={generatedReply || ''}
               inputProps={{readOnly:true}}/>
               <Button 
               variant='outlined'
               sx={{mt:2}}
               onClick={()=>navigator.clipboard.writeText(generatedReply)}>
                Copy to Clipboard
               </Button>

           </Box>)}

      </Container>
    </>
  )
}

export default App
