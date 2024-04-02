import pyttsx3

engine = pyttsx3.init()

voices = engine.getProperty('voices')

engine.setProperty('voice', voices[0].id)

mytext = 'Chaitanya has been marked present'

engine.setProperty('rate', 150)
engine.setProperty('volume', 0.9)
engine.say(mytext)

engine.runAndWait()
