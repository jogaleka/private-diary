import { useEffect, useState } from "react";
import "./App.css";

type DiaryEntry = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      loadEntries();
    }
  }, [token]);

  const login = async () => {
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        setMessage("Invalid email or password");
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMessage("");
    } catch {
      setMessage("Backend unavailable");
    }
  };

  const register = async () => {
    setMessage("Creating account...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        setMessage("Could not create account");
        return;
      }

      setIsRegistering(false);
      setMessage("Account created. Please login.");
      setPassword("");
    } catch {
      setMessage("Backend unavailable");
    }
  };

  const loadEntries = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/diary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setMessage("Session expired. Please login again.");
        localStorage.removeItem("token");
        setToken(null);
        return;
      }

      const data = await response.json();

      setEntries(data);
      setMessage("");
    } catch {
      setMessage("Backend unavailable");
    }
  };

  const createEntry = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/diary", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        setMessage("Could not create entry");
        return;
      }

      const newEntry = await response.json();

      setEntries((current) => [newEntry, ...current]);

      setTitle("");
      setContent("");
      setShowForm(false);
      setMessage("");
    } catch {
      setMessage("Backend unavailable");
    }
  };

  const updateEntry = async () => {
    if (!editingId) return;

    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/diary/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      if (!response.ok) {
        setMessage("Could not update entry");
        return;
      }

      const updatedEntry = await response.json();

      setEntries((current) =>
        current.map((entry) =>
          entry.id === editingId ? updatedEntry : entry
        )
      );

      setEditingId(null);
      setTitle("");
      setContent("");
      setShowForm(false);
      setMessage("");
    } catch {
      setMessage("Backend unavailable");
    }
  };

  const deleteEntry = async (id: number) => {
    if (!confirm("Delete this diary entry?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/diary/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setMessage("Could not delete entry");
        return;
      }

      setEntries((current) =>
        current.filter((entry) => entry.id !== id)
      );
    } catch {
      setMessage("Backend unavailable");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setEntries([]);
  };

  if (!token) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">✦ My Private Diary</div>

        <p className="tagline">
          Your thoughts. Your space.
        </p>

        <h2>{isRegistering ? "Create your account" : "Welcome back"}</h2>

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button
          className="primary-button"
          onClick={isRegistering ? register : login}
        >
          {isRegistering ? "Create Account" : "Login"}
        </button>

        {message && <p className="message">{message}</p>}

        <br />

        <button
          className="secondary-button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage("");
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}

  return (
  <div className="diary-page">
    <header className="header">
      <div className="header-inner">
        <div className="logo">✦ My Private Diary</div>

        <button className="secondary-button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>

    <main className="container">
      <div className="welcome">
        <h1>Your private space</h1>
        <p>
          Write down whatever is on your mind. This space is yours.
        </p>
      </div>

      {message && <div className="message">{message}</div>}

      <button
        className="new-entry-button"
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setTitle("");
          setContent("");
        }}
      >
        {showForm ? "Cancel" : "+ New Entry"}
      </button>

      {showForm && (
        <div className="entry-form">
          <h2>{editingId ? "Edit Entry" : "New Entry"}</h2>

          <input
            className="input"
            type="text"
            placeholder="Give your entry a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="input"
            placeholder="Write what's on your mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />

          <button
            className="primary-button"
            onClick={editingId ? updateEntry : createEntry}
          >
            {editingId ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="empty-state">
          <h2>Your diary is empty</h2>
          <p>
            Start writing. Your first entry is waiting.
          </p>
        </div>
      ) : (
        <div>
          {entries.map((entry) => (
            <div className="entry-card" key={entry.id}>
              <h3>{entry.title}</h3>

              <div className="entry-content">
                {entry.content}
              </div>

              <p className="entry-date">
                {new Date(entry.createdAt).toLocaleString()}
              </p>

              <div className="entry-actions">
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditingId(entry.id);
                    setTitle(entry.title);
                    setContent(entry.content);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteEntry(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  </div>
);
}

export default App;