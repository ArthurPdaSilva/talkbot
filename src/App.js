import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiGitlab } from "react-icons/fi";
import { getDocs, addDoc, collection } from 'firebase/firestore'
import db from './services/firebaseConnection';
import './style.css';

export default function App() {
    const [talk, setTalk] = useState('');
    const [wait, setWait] = useState(false);
    const [dialogue, setDialogue] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        async function loading(){
            const response = await getDocs(collection(db, 'answers')).then(snapshot => {
                const isCollectionEmpty = snapshot.size === 0;

                if(!isCollectionEmpty){
                    let list = [];
                    
                    snapshot.forEach(doc => {
                        list.push({talk: doc.data().talk});
                    });

                    setAnswers(list);
                }
            })
        }

        loading()
    }, [answers]);

    useEffect(() => {
        async function loadingQuestions(){
            const response = await getDocs(collection(db, 'questions')).then(snapshot => {
                const isCollectionEmpty = snapshot.size === 0;
        
                if(!isCollectionEmpty){
                    let list = [];
                    
                    snapshot.forEach(doc => {
                        list.push({talk: doc.data().talk});
                    });
                    
                    setQuestions(list);
                }
            })

        }

        loadingQuestions()
    }, [questions])

    const handleDone = useCallback(() => {
        async function submit(){
            if(talk !== ''){
                const questionIndex = questions.findIndex(item => item.talk === talk);
                setDialogue(itens => [...itens, talk]);
                if(!wait){
                    console.log(questionIndex)
                    if(questionIndex === -1){
                        await addDoc(collection(db, 'questions'), {
                            talk
                        }).then(() => {
                            setDialogue(item => [...item, 'Por favor, me diga como devo responder!']);
                            setWait(true);
                        })
                        let list = questions;
                        list.push({talk: talk});
                        setQuestions(list);
                    }else{
                        setDialogue(item => [...item, answers[questionIndex].talk]);
                    }
                }else{
                    await addDoc(collection(db, 'answers'), {
                        talk
                    }).then(() => {
                        setDialogue(itens => [...itens, 'Entendi, salvarei na minha mente!']);
                        setWait(false);
                    })
                    let list = answers;
                    list.push({talk: talk});
                    setAnswers(list);
                }
                setTalk('');
            }else{
                alert('Digite alguma coisa!!!');
            }
        }

        submit()
    }, [answers, dialogue, questions, talk, wait])

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

