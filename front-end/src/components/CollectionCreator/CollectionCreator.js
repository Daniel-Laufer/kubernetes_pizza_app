import { useHistory } from "react-router-dom";
import { useState } from "react";
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import "./CollectionCreator.css";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as _ from 'underscore';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Divider from '@material-ui/core/Divider';
// import { createTheme, ThemeProvider } from '@material-ui/core/styles';
// import { green } from '@material-ui/core/colors';




export default function CollectionCreator() {
    const defaultFlashcardData  = [{id: 1, isFlipped: false, front_text: "", back_text: "", createdAt: Date.now()}];
    const [collectionDetails, setCollectionDetails] = useState({title: "", description: "", public: true});
    const [flashcardData, setFlashcardData] = useState(defaultFlashcardData);
    const history = useHistory();


    const handleSubmit = (event) => {
        event.preventDefault(); // ensure page doesn't reload 
        const config = {
            headers: {
                "auth-token": localStorage.getItem("auth-token")
            }
        }
        const payload = {
          title: collectionDetails.title,
          public: collectionDetails.public,
          description: collectionDetails.description,
          public: collectionDetails.public,
          flashcards: flashcardData
        }   

        console.log(JSON.stringify(payload));
        
        axios.post("api/flashcard_collections/createWithArray", payload, config)
          .then((res) => {
            console.log("success!");
            setTimeout(() => history.push("/"), 800);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const handleClickForNewFlashcard = (event) => {
        const newFlashcard =  {id: flashcardData[flashcardData.length - 1].id + 1, front_text: "", back_text: "", createdAt: Date.now()};
        
        setFlashcardData([...flashcardData, newFlashcard]);

      };

      const handleDeleteCard = (flashcard) => {
        if(flashcardData.length === 1) return setFlashcardData(defaultFlashcardData);
        setFlashcardData(flashcardData.filter((item) => item.id !== flashcard.id));
      };

      const flipFlashcard = (flashcard) => {
        const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
        const updatedFlashcard = {...flashcard, isFlipped: !flashcard.isFlipped};

        //sorting to maintain the correct ordering
        setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "createdAt"));
      };

      const handleUpdatingFlashcardDataText =(event, flashcard) => {
        const otherFlashcards = flashcardData.filter(item => item.id !== flashcard.id);
        
        let updatedFlashcard;
        if(event.target.name == "front-input") updatedFlashcard = {...flashcard, front_text: event.target.value};
        else updatedFlashcard = {...flashcard, back_text: event.target.value};

        //sorting to maintain the correct ordering
        setFlashcardData(_.sortBy([...otherFlashcards, updatedFlashcard], "createdAt"));
      }





      return (
          
        <div className="collectionCreatorContainer">
            <Fab className="backArrowButton" color="primary" aria-label="add" onClick={() => history.push("/")}>
                <ArrowBackIcon />
            </Fab>
            

            <div className="collectionDetailsCreator">
              <h4>Details about your new flashcard collection:</h4>
              <TextField 
                id="standard-basic" 
                label="Title" 
                name="title" 
                value={collectionDetails.title}
                onChange={(e) => setCollectionDetails({...collectionDetails, [e.target.name]:e.target.value})} />
              <TextField
                id="standard-textarea"
                label="Description"
                placeholder="Placeholder"
                multiline
                name="description" 
                value={collectionDetails.description}
                onChange={(e) => setCollectionDetails({...collectionDetails, [e.target.name]:e.target.value})}/>
                
            </div>
            <Divider variant="middle" />
            {
                flashcardData.map((flashcard) => {
                    return (
                    <ReactCardFlip  key={flashcard.id} isFlipped={flashcard.isFlipped} flipDirection="horizontal">
                        <div className="front" className="cardContainer">
                          <h2 className="cardQuestionHeader">What would you like to have on the front of this card?</h2>
                          <TextField
                          id="outlined-textarea"
                          multiline
                          rows={6}
                          name="front-input"
                          placeholder={"For example:\n\nHow do you say \"thank you\" in french?"}
                          variant="outlined"
                          value={flashcard.front_text}
                          onChange={(event) => handleUpdatingFlashcardDataText(event, flashcard)}
                          />
                          <Button
                          className="flipButton"
                          variant="contained"
                          onClick={() => flipFlashcard(flashcard)}
                          >
                              Flip
                          </Button>
                          <Fab className="deleteCardButton" color="secondary" aria-label="delete" onClick={() => handleDeleteCard(flashcard)}>
                              <DeleteOutlineIcon />
                          </Fab>
                      </div>
                        <div className="back" className="cardContainer">
                          <h2 className="cardQuestionHeader">What would you like to have on the back of this card?</h2>
                          <TextField
                          id="outlined-textarea"
                          multiline
                          rows={6}
                          name="back-input"
                          placeholder={"For example (continuing with previous example):\n\n \"Merci\" "}
                          variant="outlined"
                          value={flashcard.back_text}
                          onChange={(event) => handleUpdatingFlashcardDataText(event, flashcard)}
                          />
                          <Button
                          className="flipButton"
                          variant="contained"
                          onClick={() => flipFlashcard(flashcard)}
                          >
                              Flip
                          </Button>
                          <Fab className="deleteCardButton" color="secondary" aria-label="delete" onClick={() => handleDeleteCard(flashcard)}>
                              <DeleteOutlineIcon />
                          </Fab>
                      </div>
                    </ReactCardFlip>
                )
                })
            }
            <Fab className="addCardButton" color="primary" aria-label="add" onClick={handleClickForNewFlashcard}>
              <AddIcon />
            </Fab>
            <div>
              <Button
                variant="contained"
                color="primary"
                size="large"
                style={{color:"white", borderRadius:"10%", marginTop:"30px"}}
                startIcon={<DoneOutlineIcon />}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
        </div>
      );


}