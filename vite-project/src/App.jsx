/* App.jsx с логотипом */
import React, { useEffect, useState, useRef } from "react";
import './App.css'; // импортируем CSS
import logo from './assets/logo.png'; // импорт логотипа

export default function App() {
  const DATA_URL = "https://cloud.codesupply.co/endpoint/react/data.json";

  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuHidden, setMenuHidden] = useState(false);

  const stickyRef = useRef(null);
  const stickStartRef = useRef(0);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => r.json())
      .then((data) => {
        const arr = data.posts || data || [];
        setPosts(arr);
      })
      .catch((e) => console.error("Failed to fetch posts", e));
  }, []);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const updateStart = () => {
      const rect = el.getBoundingClientRect();
      stickStartRef.current = window.scrollY + rect.top;
    };
    updateStart();
    window.addEventListener("resize", updateStart);
    const onScroll = () => {
      const sy = window.scrollY;
      const start = stickStartRef.current;
      const last = lastScrollRef.current;
      if (sy > start + 200) {
        setMenuHidden(sy > last);
      } else {
        setMenuHidden(false);
      }
      lastScrollRef.current = sy;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateStart);
    };
  }, []);

  const filtered = posts.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const imageAttrs = (post) => {
    const src = post.image || post.img || "";
    const src2 = post.image2x || post.img_2x || src;
    return { src, srcSet: `${src} 1x, ${src2} 2x` };
  };

  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <header>
        <div className="header-top">
          <div className="logo-area"> 
            <img src={logo} alt="Logo" className="logo-img" />
            <div>
              <div className="site-name">Example</div>
              <div className="site-desc">Demo header</div>
            </div>
          </div>
          <button className="hamburger" onClick={() => setMobileOpen(true)}>
            &#9776;
          </button>
          <input type="search" placeholder="Поиск постов..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input desktop-search" />
        </div>
        <div ref={stickyRef} className={`sticky-menu ${menuHidden ? 'hide' : ''}`}>
          <nav>
            <ul>
              <li className="group">
                Каталог
                <ul className="submenu">
                  <li>Категория 1</li>
                  <li>Категория 2</li>
                </ul>
              </li>
              <li className="group">
                Блог
                <ul className="submenu">
                  <li>Новости</li>
                  <li>Аналитика</li>
                </ul>
              </li>
              <li>О нас</li>
              <li>Контакты</li>
            </ul>
          </nav>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-menu">
          <div className="overlay" onClick={() => setMobileOpen(false)}></div>
          <div className="menu">
            <button className="close-btn" onClick={() => setMobileOpen(false)}>×</button>
            <ul>
              <li>Каталог</li>
              <li>Блог</li>
              <li>О нас</li>
              <li>Контакты</li>
            </ul>
          </div>
        </div>
      )}

      <main>
        <input type="search" placeholder="Поиск постов..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input mobile-search" />
        <section className="posts-grid">
          {filtered.map(post => (
            <article key={post.id} className="post-card" onClick={() => setSelected(post)}>
              <img {...imageAttrs(post)} alt={post.title} />
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <div className="post-meta">
                <span>{post.author || 'Автор'}</span>
                <span>{post.date || 'дата'}</span>
              </div>
            </article>
          ))}
        </section>
      </main>

      {selected && (
        <div className="modal">
          <div className="overlay" onClick={() => setSelected(null)}></div>
          <div className="content">
            <div className="modal-header">
              <h2>{selected.title}</h2>
              <button onClick={() => setSelected(null)}>Закрыть</button>
            </div>
            <img {...imageAttrs(selected)} alt={selected.title} />
            <p>{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
