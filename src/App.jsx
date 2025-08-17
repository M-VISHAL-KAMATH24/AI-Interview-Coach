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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-950 to-red-900 flex flex-col items-center justify-center p-6 gap-10">
      <h1 className="text-7xl text-white">AI Interview Coach Starter Code</h1>
    </div>
  );
}

export default App;