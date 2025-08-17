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
      <h1 className="text-6xl sm:text-8xlfont-bold bg-gradient-to-r from-emerald-400 via-sky-300 to blue-500 bg-clip-text text-transparent text-center">AI Interview Coach </h1>
      <div className="w-full max-w-7xl flex flex-col items -center justify-center">
        {!questionData?(
          <div className="w-full max-w-md p-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-lg shadow-sky-600 hover:shadow-2xl hover:shadow-sky-400 transition duration-300 text-center">
            <Code className="mx-auto mb-6 text-cyan-400 w-24 h-24"/>
            <h2 className="text-3xl font-semibold text-white mb-4 ">Are You Ready ..!</h2>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">Solve the Coding Interview Questions Get Hints and Imporve Your Skills..!</p>
            <div className="mb-8">
              <p className="text-sky-400 mb-4 font-semibold text-lg text-left">Seelect Difficulty Level</p>
              <div className="flex justify-center gap-3 flex-wrap sm:flex-nonwrap">
                {["Beginner","Medium","Intermediate"].map((level)=>(
                  <button key={level} onClick={()=>handleDifficultySelect(level)}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 cursor-pointer ${
                    difficulty===level?
                    "bg-blue-500 text-white shadow-mb":
                    "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
            {warning &&(
              <p className="text-red-500 font-semibold mb-4">{warning}</p>
            )}
            <button onClick={generateQuestion} disabled={!aiReady || loading} className="w-full px-10 py-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold text-lg rounded-3xl shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{loading?"Generating...":"Generate question"}</button>
          </div>
        ):(
          <div className="space-y-6 w-full">
            <div className="grid lg:grid-cols-2 gap-6"></div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;