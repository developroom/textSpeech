//init SpeetchSynth API
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');
const recordBtn = document.querySelector('#record');
const recordResult = document.querySelector('#record-result');

//Init voices array
let voices = [];
let recordedSpeech = '';

//Init function that download voices
const getVoices = () => {
    voices = synth.getVoices();

    //Loop through voices and create an option for eatch one
    voices.forEach(voice =>{
        //Create an option element
        const option = document.createElement('option');
        //Fill option with the voice
        option.textContent = `${voice.name} (${voice.lang})`;
        //Set needed option atributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
};

getVoices();
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}

//record
const record = () =>{
    //record it on click
    recordBtn.addEventListener('click', ()=>{
        speakToText();
    });
};
record();

//SpeetchAPI to text
const speakToText = () =>{
    //setting speetch api
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    //recognition set start of voice
    recognition.addEventListener('start', ()=>{
        console.log('Voice has started')
    });
    //recognition set of record
    recognition.addEventListener('speechend',()=>{
        console.log('Just turn off');
    });
    //recognition set result for return
    recognition.addEventListener('result', e =>{
        let current = e.resultIndex;
        recordedSpeech = e.results[current][0].transcript;
        recordResult.innerHTML = `You say: ${e.results[current][0].transcript}`;
    });
    //recognition errors
    recognition.addEventListener('error', e =>{
        if(e.error == 'no-speech'){
            console.log('You dont speech anything');
        };
    });
    //recognition set start
    recognition.start();
};

// Speak 
const speak = () => {
    //Check if speaking
    if(synth.speaking){
        console.error('Already Speaking');
        return;
    }
    if(textInput.value !== ''){
        //Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        //Speak End
        speakText.onend = e => {
            console.log('done speaking  ..');
        };
        //Speak Error
        speakText.onerror = e => {
            console.error('Someting went wrong');
        };
        //Select the voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        //Loop througth voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });
        //Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;
        //Speak
        synth.speak(speakText);
    }
};
//Event listeners

//text form submit
textForm.addEventListener('submit', e =>{
    e.preventDefault();
    speak();
    textInput.blur();
});
//rate value change 
rate.addEventListener('change', e => rateValue.textContent = rate.value);
//pitch value change 
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);
//voice select change
voiceSelect.addEventListener('change', e => speak());