import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiGitlab } from "react-icons/fi";
import { getDoc, updateDoc, doc } from 'firebase/firestore'
import db from './services/firebaseConnection';
import './style.css';

export default function App() {
    const [talk, setTalk] = useState('');
    const [wait, setWait] = useState(false);
    const [dialogue, setDialogue] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function loadingQuestions(){
            await getDoc(doc(db, 'questions', 'questionsList')).then(snapshot => {
                setQuestions(snapshot.data().questions);
            })

            await getDoc(doc(db, 'answers', 'answersList')).then(snapshot => {
                setAnswers(snapshot.data().answers);
            })
        }

        loadingQuestions();
    }, [questions])

    const handleDone = useCallback(() => {
        async function submit(){
            if(talk !== ''){
                const questionIndex = questions.indexOf(talk);
                setDialogue(itens => [...itens, talk]);
                if(!wait){
                    if(questionIndex === -1){
                        let lista = questions;
                        lista.push(talk);
                        await updateDoc(doc(db, 'questions', 'questionsList'), {
                            questions: lista
                        }).then(() => {
                            setDialogue(item => [...item, 'Por favor, me diga como devo responder!']);
                            setWait(true);
                        })
                        
                        setQuestions(lista);
                        console.log(questions);
                    }else{
                        setDialogue(item => [...item, answers[questionIndex]]);
                    }

                }else{
                    let lista = answers;
                    lista.push(talk);
                    await updateDoc(doc(db, 'answers', 'answersList'), {
                        answers: lista
                    }).then(() => {
                        setDialogue(itens => [...itens, 'Entendi, salvarei na minha mente!']);
                        setWait(false);
                    })

                    
                    setAnswers(lista);
                    console.log(answers);
                }
                setTalk('');
            }else{
                alert('Digite alguma coisa!!!');
            }
        }
        submit()
    }, [answers, questions, talk, wait])

    return (
        <div className="app">
            <h1>Talk Bot</h1>
            <div className="container">
                <div className="conversation">
                    {dialogue.map((item, index) => (
                        <div className={index % 2 === 0 ? 'talk talkUser' : 'talk'} key={index}>
                            <label>{item}</label>
                            {index % 2 === 0 ? 
                                (<FiUser size={74} color='#4C2A85'/>) : 
                                (<FiGitlab size={74} color='#4C2A85'/>)
                            }
                        </div>
                    ))}
                </div>
                <div className="sendInformation">
                    <input type="text" value={talk} onChange={(e) => setTalk(e.target.value)}/>
                    <button type='button' onClick={handleDone}> SEND </button>
                </div>
            </div>
        </div>
    );
}

