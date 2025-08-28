import React, { useEffect, useState } from "react";

const ExplorePage = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/recent-designs")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text(); // read raw text for debug if JSON fails
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}\n${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setDesigns(data.designs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ textAlign: "center", flexGrow: 1 }}>Explore Recent Designs</h1>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#1c463d",
            userSelect: "none",
            marginLeft: 20,
            height: "40px",
          }}
          aria-label="Go to Home"
        >
          Go to Home
        </button>
      </div>

      <p
        style={{
          textAlign: "center",
          maxWidth: 700,
          margin: "auto",
          fontSize: 18,
          color: "#fff",
        }}
      >
        Discover beautiful AI-generated house plans and architectural designs. Explore recent creations from users.
      </p>

      {loading && <p style={{ textAlign: "center", fontStyle: "italic" }}>Loading designs...</p>}

      {error && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            color: "red",
            maxHeight: 300,
            overflowY: "auto",
            backgroundColor: "#fee",
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Error: {error}
        </pre>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 30,
        }}
      >
        {designs.map((design) => (
          <div
            key={design.scene_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onClick={() => window.open(`/design/${design.scene_id}`, "_blank")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={design.image}
              alt={design.prompt}
              style={{ width: "100%", height: 180, objectFit: "cover" }}
              loading="lazy"
            />
            <div style={{ padding: 12 }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{design.prompt}</h3>
              <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
                Generated on: {new Date(design.timestamp).toLocaleDateString()}
              </p>
              <p style={{ margin: 0, color: "#888", fontSize: 12 }}>User ID: {design.user_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
