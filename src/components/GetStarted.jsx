import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import LogoutButton from "../components/LogoutButton";
import { motion } from "framer-motion";
import VoiceAssistant from "../components/VoiceAssistantt";
import FloorPlan from "../components/FloorPlan";
import ExportMenu from "../components/ExportMenu";

const GetStarted = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [headerMoved, setHeaderMoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef(null);
  const [latestLayout, setLatestLayout] = useState(null);
  const [user, setUser] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setValidationMessage("");
  };

  const handleSubmission = async (customPrompt) => {
    const finalPrompt = customPrompt || input;

    if (!finalPrompt.trim()) {
      setValidationMessage("⚠️ Please enter a prompt to generate design.");
      return;
    }

    setValidationMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/generate-design", {
        prompt: finalPrompt,
      });
      const data = response.data;

      let layoutJson = null;
      if (data.scene_id) {
        try {
          const layoutRes = await fetch(
            `http://localhost:8000/static/outputs/${data.scene_id}/${data.scene_id}_layout.json`
          );
          if (!layoutRes.ok) throw new Error("Failed to fetch layout JSON");
          layoutJson = await layoutRes.json();
          setLatestLayout(layoutJson);
        } catch (err) {
          console.error("Error fetching layout JSON:", err);
          setValidationMessage("Warning: Could not load 3D layout.");
        }
      }

      const chatMessage = {
        prompt: finalPrompt,
        message: data.message || "Design generated successfully",
        image: data.image_url || data.image || null,
        scene_id: data.scene_id || null,
        timestamp: new Date().toLocaleTimeString(),
        layoutJson,
      };

      setChatHistory((prev) => [...prev, chatMessage]);
      setInput("");
      setHeaderMoved(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error: Could not generate design.";
      setChatHistory((prev) => [
        ...prev,
        {
          prompt: finalPrompt,
          message: `ARCSPECT: ${errorMessage}`,
          timestamp: new Date().toLocaleTimeString(),
          layoutJson: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSubmission();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      backgroundImage: 'url("/background.jpg")',
      backgroundSize: "cover",
      position: "relative",
      color: "#FFF",
      paddingBottom: "120px",
    },
    scrollArea: {
      width: "100%",
      height: "calc(100vh - 160px)",
      overflowY: "auto",
      paddingTop: "120px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    promptWrapper: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      padding: "10px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 5,
    },
    textInputWrapper: {
      position: "relative",
      width: "60%",
    },
    textArea: {
      width: "100%",
      height: "70px",
      padding: "8px 50px 8px 12px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #aaa",
      backgroundColor: "rgba(255,255,255,0.85)",
      color: "#333",
      resize: "none",
    },
    micButton: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      zIndex: 10,
    },
    button: {
      width: "180px",
      height: "40px",
      fontSize: "14px",
      marginTop: "8px",
      backgroundColor: loading ? "#aaa" : "#FF6347",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: loading ? "not-allowed" : "pointer",
    },
    validationMessage: {
      color: "#FFD700",
      marginTop: "5px",
      fontWeight: "bold",
    },
    toggleButton: {
      position: "fixed",
      top: "10px",
      left: "10px",
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      zIndex: 100,
    },
    sidebar: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "300px",
      height: "100%",
      backgroundColor: "rgba(10, 60, 48, 0.95)",
      color: "white",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      zIndex: 10,
    },
    output: {
      marginBottom: "20px",
      textAlign: "left",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      padding: "15px",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "1100px",
      color: "#fff",
    },
    timestamp: {
      fontSize: "12px",
      color: "#ccc",
      marginTop: "6px",
    },
  };

  return (
    <>
      <div style={styles.container}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.toggleButton}
          aria-label="Toggle chat sidebar"
        >
          ☰
        </button>

        <motion.div
          initial={{ top: "30%", left: "50%", x: "-50%", y: "-50%", position: "absolute" }}
          animate={
            headerMoved
              ? {
                  position: "fixed",
                  top: "10px",
                  left: "60px",
                  x: 0,
                  y: 0,
                  scale: 0.75,
                }
              : {}
          }
          transition={{ duration: 0.6 }}
          style={{
            zIndex: 20,
            color: "white",
            textAlign: "center",
            position: "absolute",
          }}
        >
          <h1 style={{ margin: 0 }}>ARCSPECT</h1>
          {!headerMoved && (
            <p style={{ marginTop: "8px" }}>
              Describe your design ideas, and we'll create 2D and 3D visualizations instantly.
            </p>
          )}
        </motion.div>

        {sidebarOpen && (
          <div style={styles.sidebar}>
            <button onClick={() => setSidebarOpen(false)} style={styles.button}>Close</button>
            <h3>Chat History</h3>
            {chatHistory.map((item, index) => (
              <div key={index}>
                <p><strong>You:</strong> {item.prompt}</p>
                <p><strong>ARCSPECT:</strong> {item.message}</p>
                {item.timestamp && <p style={styles.timestamp}>{item.timestamp}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt="2D Layout"
                      style={{ width: "140px", borderRadius: "4px" }}
                    />
                  )}
                  {item.layoutJson && (
                    <div style={{ width: "140px", height: "140px" }}>
                      <FloorPlan rooms={item.layoutJson} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.scrollArea}>
          {chatHistory.map((item, index) => (
            <div key={index} style={styles.output}>
              <p><strong>You:</strong> {item.prompt}</p>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                {item.image && (
                  <div style={{ flex: "1 1 45%", maxWidth: "600px" }}>
                    <p><strong>Generated 2D Layout:</strong></p>
                    <img src={item.image} alt="Generated Design" style={{ width: "100%", borderRadius: "8px" }} />
                  </div>
                )}
                {item.layoutJson && (
                  <div style={{ flex: "1 1 45%", maxWidth: "600px", height: "550px" }}>
                    <p><strong>Generated 3D Layout:</strong></p>
                    <FloorPlan rooms={item.layoutJson} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <motion.div
        initial={{ top: "50%", left: "50%", x: "-50%", position: "absolute" }}
        animate={
          headerMoved
            ? {
                top: "auto",
                bottom: 0,
                left: 0,
                x: 0,
                position: "fixed",
              }
            : {}
        }
        transition={{ duration: 0.6 }}
        style={styles.promptWrapper}
      >
        <div style={styles.textInputWrapper}>
          <textarea
            placeholder="Enter your prompt here"
            style={styles.textArea}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <div style={styles.micButton} title={isRecording ? "🎤 Listening..." : "Tap to speak"}>
            <VoiceAssistant
              onPromptSubmit={(value, submitNow) => {
                setInput(value);
                if (submitNow) handleSubmission(value);
              }}
              setIsRecording={setIsRecording}
            />
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: isRecording ? "#ff4d4d" : "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#fff",
                boxShadow: isRecording ? "0 0 12px 4px rgba(255,77,77,0.6)" : "0 0 4px rgba(0,0,0,0.1)",
                animation: isRecording ? "pulse 1s infinite" : "none",
                transition: "all 0.3s ease-in-out",
              }}
            >
              🎤
            </div>
          </div>
        </div>
        <button style={styles.button} onClick={handleSubmission} disabled={loading}>
          {loading ? "Generating..." : "Generate 2D & 3D Design"}
        </button>
        {validationMessage && <div style={styles.validationMessage}>{validationMessage}</div>}
      </motion.div>
    </>
  );
};

export default GetStarted;
