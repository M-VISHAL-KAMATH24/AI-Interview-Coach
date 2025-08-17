import { useState,useEffect } from "react";
import {Code,Play,RotateCcw,CheckCircle,ArrowLeft} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {dracula} from "@uiw/codemirror-theme-dracula"

function App() {

  const [aiReady ,setAiReady]=useState(false);
  const [questionData,setQuestionData]=useState(null);
  const [code,setCode]=useState(`function solution(){\nyour ocde here \n}`);
  const [feedback,setFeedback]=useState("");
  const [loading,setLoading]=useState(false);
  const [solved,setSolved]=useState(false);
  const [difficulty,setDifficulty]=useState("");
  const [warning,setWarning]=useState("")


  useEffect(()=>{
    const checkReady=setInterval(()=>{
      if(window.puter?.ai?.chat){
        setAiReady(true);
        clearInterval(checkReady);
      }
    },3000)
    return ()=>clearInterval(checkReady)
  },[])

  const handleDifficultySelect=(level)=>{
    setDifficulty(level);
    if(warning) setWarning("");
  }
  const generateQuestion=async()=>{
    const validLevels=["Beginner","Medium","Intermediate"];
    if(!validLevels.includes(difficulty)){
      setWarning("please select the difficulty level before generating the question");
      return;
    }
    setWarning("");
    setLoading(true);
    setFeedback("");  
    setSolved(false);
    setCode(`function solution(){\nyour ocde here \n}`);
    setQuestionData(null);

    try{
      const res=await window.puter.ai.chat(
        `
        Generate a random ${difficulty} level coding interview question like on leetcode.Return only valid JSON with structure:{
        "problem":"string",
        "example":"string",
        "constrations:"string",
        "note":"string or empty if none" 
               }`
      );
      const reply=typeof res==="string" ? res: res.message?.content|| "";
      const parsed=JSPN.parse(reply);
      setQuestionData(parsed);


    }catch(err){
      setFeedback(`Error:${err.message}`)
    }
    setLoading(false);
  }
  const checkSolution=async()=>{
    if(!code.trim()) return;
    setLoading(true);
    try{
      const res=await window.puter.ai.chat(
        `you are the helpful interview coach.the question is ${questionData?.problem} . here is the candidates solution:\n ${code}
        1.if correct say: "Correct..! well done"
        2.if wrong give hints but dont reveal the full answer.
        ` 
      )
       const reply=typeof res==="string" ? res: res.message?.content|| "";
       setFeedback(reply);
       if(reply.includes("Correct..!")) setSolved(true);
    }catch(err){;
      setFeedback(`Error:${err.message}`)
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-950 to-red-900 flex flex-col items-center justify-center p-6 gap-10">
      <h1 className="text-7xl text-white">AI Interview Coach Starter Code</h1>
    </div>
  );
}

export default App;