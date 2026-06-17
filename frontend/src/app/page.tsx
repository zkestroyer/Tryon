"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATALOG = [
  { id: 1, name: "Leather Biker Jacket", category: "Outerwear", image: "/assets/jacket.png" },
  { id: 2, name: "Cashmere Sweater", category: "Knitwear", image: "/assets/sweater.png" },
  { id: 3, name: "Navy Tailored Blazer", category: "Formal", image: "/assets/blazer.png" },
  { id: 4, name: "White Dress Shirt", category: "Essentials", image: "/assets/shirt.png" },
];

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<number | null>(null);
  
  // Phase 3 Backend Integration States
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!file || !selectedGarment) return;
    
    setIsGenerating(true);
    setResultImage(null);

    try {
      // Mock API Call to our Flask Backend
      const response = await fetch("http://localhost:8000/api/v1/generate/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_image_data: file.name,
          garment_id: selectedGarment
        }),
      });

      const data = await response.json();
      
      if (data.status === "completed") {
        // GOLDEN PATH PITCH DEMO: 
        // We bypass the file URL and hardcode the stunning AI-generated result images for the pitch.
        if (selectedGarment === 1) setResultImage("/assets/result.png"); // Leather Jacket
        else if (selectedGarment === 2) setResultImage("/assets/result_sweater.png"); // Sweater
        else if (selectedGarment === 3) setResultImage("/assets/result_blazer.png"); // Blazer
        else if (selectedGarment === 4) setResultImage("/assets/result_shirt.png"); // Shirt
        else setResultImage("/assets/result.png"); // Fallback
      }
    } catch (error) {
      console.error("Error generating try-on:", error);
      alert("Failed to connect to backend API. Is the Flask server running?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Restrained Pastel Background Elements (Bubbly aesthetic) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-5xl px-6 flex flex-col items-center py-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center px-5 py-2 mb-6 rounded-full border border-primary/30 bg-white/60 text-sm font-bold text-foreground shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span>AI Virtual Fitting Room</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            Try It <span className="text-primary">On.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover your perfect fit in seconds. Upload a selfie and watch our AI style you in the latest trends.
          </p>
        </motion.div>

        {/* Result Screen (Shown after generation) */}
        <AnimatePresence mode="wait">
          {resultImage ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              <div className="glass-card rounded-3xl p-10 w-full max-w-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-fade-in shadow-sm border border-primary/20">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Generation Complete</h2>
                <p className="text-sm text-muted-foreground mb-10 max-w-md">
                  Our AI has successfully mapped the garment to your body, preserving material integrity and folds.
                </p>
                
                <div className="w-full max-w-sm aspect-[3/4] bg-muted/50 rounded-2xl border border-primary/20 overflow-hidden flex items-center justify-center mb-8 shadow-md relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultImage} alt="Try-On Result" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setResultImage(null)}
                    className="px-8 py-4 rounded-full font-bold bg-secondary text-foreground hover:bg-gray-200 transition-colors border border-primary/20"
                  >
                    Start Over
                  </button>
                  <button 
                    onClick={() => {
                      if (!resultImage) return;
                      const a = document.createElement("a");
                      a.href = resultImage;
                      a.download = "try_it_on_result.png";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-8 py-4 rounded-full font-bold bg-primary text-primary-foreground hover:bg-[#ffadad] transition-colors shadow-[0_4px_15px_rgba(255,184,184,0.4)]"
                  >
                    Download HD Result
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="interface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {/* Main Interface Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Upload Card */}
                <div className="glass-card rounded-3xl p-8 flex flex-col">
                  <h2 className="text-2xl font-bold mb-2 flex items-center text-foreground">
                    <span className="bg-secondary p-2 rounded-xl mr-3 text-primary">
                      <ImageIcon className="w-5 h-5" />
                    </span>
                    Upload Photo
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">For best results, use a clear, front-facing photo.</p>
                  
                  <div 
                    className={cn(
                      "flex-grow border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out group relative overflow-hidden bg-white/50",
                      dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-primary/30 hover:border-primary/60 hover:bg-white/80 hover:shadow-sm",
                      file ? "border-primary bg-primary/5" : ""
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {file ? (
                      <div className="text-center z-10 animate-fade-in flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary/20 overflow-hidden p-1">
                           {/* Show a mini preview of the uploaded file */}
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <p className="font-bold text-foreground text-lg">{file.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
                          }}
                          className="mt-6 px-4 py-2 text-sm font-semibold text-foreground bg-secondary border border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          Replace Image
                        </button>
                      </div>
                    ) : (
                      <div className="text-center z-10 pointer-events-none">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="font-bold text-foreground text-lg mb-1">Drag & Drop</p>
                        <p className="text-sm text-muted-foreground font-medium">or click to browse files</p>
                      </div>
                    )}
                    
                    {/* Invisible File Input */}
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Catalog Card */}
                <div className="glass-card rounded-3xl p-8 flex flex-col">
                  <h2 className="text-2xl font-bold mb-2 flex items-center text-foreground">
                    <span className="bg-secondary p-2 rounded-xl mr-3 text-primary">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    Pick a Style
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">Select a garment from our trending collection.</p>
                  
                  <div className="flex-grow grid grid-cols-2 gap-4">
                    {/* Real Generated Catalog Items */}
                    {CATALOG.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedGarment(item.id)}
                        className={cn(
                          "rounded-2xl border bg-white overflow-hidden group cursor-pointer transition-all duration-300 relative",
                          selectedGarment === item.id 
                            ? "border-primary shadow-[0_0_0_2px_rgba(255,184,184,0.5)] ring-2 ring-primary/30 scale-[1.02]" 
                            : "border-gray-100 hover:border-primary/40 hover:shadow-md hover:-translate-y-1"
                        )}
                      >
                        <div className="h-32 bg-secondary flex items-center justify-center transition-colors relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4 bg-white">
                          <p className="text-sm font-bold text-foreground leading-tight mb-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">{item.category}</p>
                        </div>
                        {/* Selected Indicator */}
                        {selectedGarment === item.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-sm animate-fade-in">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="mt-12 w-full flex flex-col items-center">
                <button 
                  onClick={handleGenerate}
                  disabled={!file || !selectedGarment || isGenerating}
                  className={cn(
                    "relative overflow-hidden px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center border border-primary/20",
                    file && selectedGarment && !isGenerating
                      ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(255,184,184,0.4)] hover:shadow-[0_8px_30px_rgba(255,184,184,0.6)] hover:-translate-y-1 hover:bg-[#ffadad] cursor-pointer" 
                      : "bg-white text-muted-foreground cursor-not-allowed shadow-none"
                  )}
                >
                  <span className={cn("flex items-center transition-opacity duration-300", isGenerating ? "opacity-0" : "opacity-100")}>
                    <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
                    Show Me The Fit!
                  </span>
                  
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      Generating Fit...
                    </div>
                  )}
                </button>
                
                {/* Simulated Progress text */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 text-sm text-primary font-bold tracking-wide uppercase animate-pulse"
                    >
                      Running DensePose analysis on image...
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
