'use client';

import { useState, useEffect, useRef } from 'react';

const FIXED_TAGS = ['작품', '대회', '외부활동'];
const ADMIN_CREDS = { username: 'allround', password: 'training' };

const DEFAULT_WORKS = [
  { id: 1, title: "전국 로봇 대회 우승 — KRoC 2024", descHtml: "<h2>대회 개요</h2><p>자율주행 알고리즘과 커스텀 설계 섀시를 결합한 로봇으로 전국 대회 1위를 달성했습니다.</p><h2>기술 스택</h2><ul><li>STM32 기반 실시간 제어</li><li>LiDAR + 카메라 센서 퓨전</li><li>A* 경로 탐색 알고리즘</li></ul>", author: "김민준", generation: "14기", date: "2024-11-15", tags: ["대회"], image: "" },
  { id: 2, title: "ARM 기반 임베디드 제어 시스템", descHtml: "<p>STM32 MCU를 활용한 실시간 모터 제어 시스템입니다. PID 알고리즘 직접 구현 및 CAN 버스 통신을 적용했습니다.</p>", author: "이수연", generation: "13기", date: "2024-06-20", tags: ["작품"], image: "" },
  { id: 3, title: "ICRA 2024 학술대회 참관", descHtml: "<p>일본 요코하마에서 열린 국제 로봇공학 학술대회 ICRA 2024에 외부활동으로 참가했습니다.</p>", author: "박도현", generation: "12기", date: "2024-05-13", tags: ["외부활동"], image: "" },
];

const DEFAULT_AWARDS = ["전국 로봇 대회 (KRoC) 우승 2회", "한국 자율주행차 대회 (KCRC) 준우승", "로봇공학 학술제 최우수상", "산업체 연계 프로젝트 장려상"];

interface Work {
  id: number;
  title: string;
  descHtml: string;
  author: string;
  generation: string;
  date: string;
  tags: string[];
  image: string;
}

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const exec = (cmd: string, val: string | null = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val ?? undefined);
    onChange(editorRef.current?.innerHTML || '');
  };

  const handleInput = () => onChange(editorRef.current?.innerHTML || '');

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      editorRef.current?.focus();
      document.execCommand('insertImage', false, ev.target?.result as string);
      onChange(editorRef.current?.innerHTML || '');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.execCommand('insertImage', false, ev.target?.result as string);
          onChange(editorRef.current?.innerHTML || '');
        };
        reader.readAsDataURL(blob);
        return;
      }
    }
  };

  const insertHr = () => {
    editorRef.current?.focus();
    document.execCommand('insertHorizontalRule', false, undefined);
    onChange(editorRef.current?.innerHTML || '');
  };

  const formatBlock = (tag: string) => exec('formatBlock', tag);

  return (
    <div className="rich-editor-wrap">
      <div className="rich-toolbar">
        <button className="toolbar-btn" title="굵게" onMouseDown={e => { e.preventDefault(); exec('bold'); }}><b>B</b></button>
        <button className="toolbar-btn" title="기울임" onMouseDown={e => { e.preventDefault(); exec('italic'); }}><i>I</i></button>
        <div className="toolbar-sep" />
        <button className="toolbar-btn toolbar-btn-wide" title="제목 1" onMouseDown={e => { e.preventDefault(); formatBlock('h2'); }}>H1</button>
        <button className="toolbar-btn toolbar-btn-wide" title="제목 2" onMouseDown={e => { e.preventDefault(); formatBlock('h3'); }}>H2</button>
        <button className="toolbar-btn toolbar-btn-wide" title="본문" onMouseDown={e => { e.preventDefault(); formatBlock('p'); }}>¶</button>
        <div className="toolbar-sep" />
        <button className="toolbar-btn" title="목록" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}>≡</button>
        <button className="toolbar-btn" title="인용구" onMouseDown={e => { e.preventDefault(); formatBlock('blockquote'); }}>❝</button>
        <button className="toolbar-btn" title="구분선" onMouseDown={e => { e.preventDefault(); insertHr(); }}>—</button>
        <div className="toolbar-sep" />
        <button className="toolbar-btn toolbar-btn-wide" title="이미지 삽입" onMouseDown={e => { e.preventDefault(); imageInputRef.current?.click(); }}>＋이미지</button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="내용을 입력하세요."
        onInput={handleInput}
        onPaste={handlePaste}
      />
      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
    </div>
  );
}

function TagSelector({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) onChange(selected.filter(t => t !== tag));
    else onChange([...selected, tag]);
  };
  return (
    <div className="tag-selector">
      {FIXED_TAGS.map(tag => (
        <button key={tag} type="button" className={`tag-option${selected.includes(tag) ? ' selected' : ''}`} onClick={() => toggle(tag)}>
          {tag}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [isAuth, setIsAuth] = useState<{ username: string } | null>(null);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [works, setWorks] = useState<Work[]>(DEFAULT_WORKS);
  const [awards, setAwards] = useState<string[]>(DEFAULT_AWARDS);
  const [activeTag, setActiveTag] = useState('ALL');
  const [modal, setModal] = useState<null | 'add' | number>(null);
  const [formTab, setFormTab] = useState('form');
  const [form, setForm] = useState({ title: '', descHtml: '', author: '', generation: '', date: '', tags: [] as string[], image: '' });
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [gridSize, setGridSize] = useState('md');
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem('at_auth_user');
      if (s) setIsAuth(JSON.parse(s));
    } catch { }
    try {
      const s = localStorage.getItem('at_works');
      if (s) setWorks(JSON.parse(s));
    } catch { }
    try {
      const s = localStorage.getItem('at_awards');
      if (s) setAwards(JSON.parse(s));
    } catch { }
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('at_works', JSON.stringify(works)); }, [works, mounted]);
  useEffect(() => { if (mounted) localStorage.setItem('at_awards', JSON.stringify(awards)); }, [awards, mounted]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogin = () => {
    setAuthError('');
    if (!authForm.username.trim() || !authForm.password.trim()) { setAuthError('아이디와 비밀번호를 입력하세요'); return; }
    if (authForm.username === ADMIN_CREDS.username && authForm.password === ADMIN_CREDS.password) {
      const userData = { username: authForm.username };
      setIsAuth(userData);
      localStorage.setItem('at_auth_user', JSON.stringify(userData));
      setAuthForm({ username: '', password: '' });
      setLoginModal(false);
    } else {
      setAuthError('아이디 또는 비밀번호가 틀렸습니다');
    }
  };

  const handleLogout = () => {
    setIsAuth(null);
    localStorage.removeItem('at_auth_user');
  };

  const allFilterTags = ['ALL', ...FIXED_TAGS];
  const filtered = activeTag === 'ALL' ? works : works.filter(w => w.tags?.includes(activeTag));

  const openAdd = () => {
    if (!isAuth) return;
    setForm({ title: '', descHtml: '', author: '', generation: '', date: '', tags: [], image: '' });
    setJsonText(JSON.stringify(works, null, 2));
    setJsonError('');
    setFormTab('form');
    setModal('add');
  };
  const closeModal = () => setModal(null);

  const submitForm = () => {
    if (!form.title.trim()) return;
    setWorks(prev => [{ id: Date.now(), ...form }, ...prev]);
    closeModal();
  };

  const applyJson = () => {
    try {
      const p = JSON.parse(jsonText);
      if (!Array.isArray(p)) throw new Error('배열 형식이어야 합니다.');
      setWorks(p);
      setJsonError('');
      closeModal();
    } catch (e: unknown) {
      setJsonError((e as Error).message);
    }
  };

  const deleteWork = (id: number) => {
    setWorks(prev => prev.filter(w => w.id !== id));
    closeModal();
  };

  const gridCols: Record<string, string> = {
    sm: 'repeat(auto-fill,minmax(260px,1fr))',
    md: 'repeat(auto-fill,minmax(320px,1fr))',
    lg: 'repeat(auto-fill,minmax(480px,1fr))',
  };

  const detailWork = typeof modal === 'number' ? works.find(w => w.id === modal) : null;

  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  if (!mounted) return null;

  return (
    <>
      {isAuth && (
        <div className="user-badge">
          <span className="user-badge-name">{isAuth.username}</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </div>
      )}

      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">AT</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#works">Works</a></li>
          {!isAuth && (
            <li>
              <a href="#" onClick={e => { e.preventDefault(); setLoginModal(true); }} style={{ color: '#444' }}>
                멤버
              </a>
            </li>
          )}
        </ul>
      </nav>

      {loginModal && !isAuth && (
        <div className="auth-overlay" onClick={e => e.target === e.currentTarget && setLoginModal(false)}>
          <div className="auth-card">
            <div className="auth-title">MEMBER LOGIN</div>
            <input className="auth-input" placeholder="아이디" value={authForm.username} onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <input className="auth-input" type="password" placeholder="비밀번호" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            {authError && <div className="auth-error">{authError}</div>}
            <button className="auth-btn" onClick={handleLogin}>로그인</button>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-watermark">AT</div>
        <div className="hero-photo-placeholder" />
        <div className="hero-overlay" />
        <h1 className="hero-title">ALLROUND<br />TRAINING</h1>
        <div className="hero-sub">
          <span>대회 및 로봇제작 동아리</span>
          <span className="dot" />
          <span>설계 · 임베디드 · 자율주행</span>
          <span className="dot" />
          <span>EST. 2010</span>
        </div>
        <div className="hero-scroll" onClick={() => { const el = document.querySelector('#about'); if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 80, behavior: 'smooth' }); }}>
          <span>scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-inner">
          <div className="about-main">
            <div className="about-headline">
              We design<br />We build<br />We compete
            </div>
            <div className="about-body">
              로봇 설계부터 임베디드, 자율주행까지 모든 과정을 스스로 해냅니다. 매년 전국 대회 참가, 최신 기술 학습, 산업체 협력을 통해 성장합니다.
            </div>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-label">수상 실적</div>
              <div className="about-stat-list">
                {awards.map((award, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '.8rem' }}>
                    <div className="about-stat-item">{award}</div>
                    {isAuth && (
                      <button
                        style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', padding: '0 .2rem', fontSize: '13px', flexShrink: 0, transition: 'color .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ff6666')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                        onClick={() => setAwards(prev => prev.filter((_, i) => i !== idx))}
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>
              {isAuth && (
                <button className="btn-secondary" style={{ marginTop: '.6rem', fontSize: '11px', padding: '.4rem .8rem' }}
                  onClick={() => {
                    const newAward = prompt('수상 실적을 입력하세요');
                    if (newAward?.trim()) setAwards(prev => [...prev, newAward.trim()]);
                  }}>＋ 추가</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="works">
        <div className="section-header">
          <h2 className="section-title">WORKS &<br />ACTIVITIES</h2>
          <span className="section-count">{filtered.length} / {works.length} ITEMS</span>
        </div>
        <div className="filters">
          {allFilterTags.map(tag => (
            <button key={tag} className={`filter-btn${activeTag === tag ? ' active' : ''}`} onClick={() => setActiveTag(tag)}>{tag}</button>
          ))}
        </div>
        <div className="works-grid" style={{ gridTemplateColumns: gridCols[gridSize] }}>
          {filtered.length === 0 ? (
            <div className="empty"><div className="empty-icon">AT</div><div className="empty-text">아직 작업물이 없습니다</div></div>
          ) : (
            filtered.map(work => (
              <div className="card" key={work.id} onClick={() => setModal(work.id)}>
                <div className="card-thumb">
                  {work.image ? <img src={work.image} alt={work.title} /> : <div className="card-thumb-placeholder">AT</div>}
                </div>
                <div className="card-body">
                  <div className="card-tags">{(work.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
                  <div className="card-title">{work.title}</div>
                  <div className="card-desc">{stripHtml(work.descHtml)}</div>
                  <div className="card-meta">
                    <span className="card-author">{work.generation} {work.author}</span>
                    <span>{work.date?.slice(0, 7)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {isAuth && <button className="fab" onClick={openAdd} title="작업물 추가">+</button>}

      <div className={`tweaks-panel${tweaksVisible ? ' visible' : ''}`}>
        <div className="tweaks-heading">TWEAKS</div>
        <div>
          <div className="tweak-label">그리드 크기</div>
          <div className="tweak-row">
            {(['sm', 'md', 'lg'] as const).map(s => (
              <button key={s} className={`tweak-btn${gridSize === s ? ' active' : ''}`} onClick={() => setGridSize(s)}>
                {s === 'sm' ? '넓게' : s === 'md' ? '보통' : '크게'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {modal === 'add' && isAuth && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="editor-modal">
            <div className="editor-modal-header">
              <div className="editor-modal-title">NEW ENTRY</div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="editor-modal-tabs">
              <button className={`editor-modal-tab${formTab === 'form' ? ' active' : ''}`} onClick={() => setFormTab('form')}>폼 입력</button>
              <button className={`editor-modal-tab${formTab === 'json' ? ' active' : ''}`} onClick={() => { setJsonText(JSON.stringify(works, null, 2)); setFormTab('json'); }}>JSON 편집</button>
            </div>
            <div className="editor-modal-body">
              {formTab === 'form' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">제목 *</label>
                    <input className="form-input" placeholder="작업물 제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">내용</label>
                    <RichEditor value={form.descHtml} onChange={v => setForm(f => ({ ...f, descHtml: v }))} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">작성자</label>
                      <input className="form-input" placeholder="이름" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">기수</label>
                      <input className="form-input" placeholder="예: 14기" value={form.generation} onChange={e => setForm(f => ({ ...f, generation: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">날짜</label>
                      <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">썸네일 URL</label>
                      <input className="form-input" placeholder="https://..." value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">태그</label>
                    <TagSelector selected={form.tags} onChange={v => setForm(f => ({ ...f, tags: v }))} />
                  </div>
                </>
              ) : (
                <>
                  <textarea className="json-editor" value={jsonText} onChange={e => { setJsonText(e.target.value); setJsonError(''); }} spellCheck={false} />
                  {jsonError && <div style={{ color: '#ff4444', fontSize: '12px' }}>{jsonError}</div>}
                  <div className="json-hint">전체 works 배열을 직접 편집하세요.</div>
                </>
              )}
            </div>
            <div className="editor-modal-footer">
              {formTab === 'form'
                ? <><button className="btn-primary" onClick={submitForm}>추가하기</button><button className="btn-secondary" onClick={closeModal}>취소</button></>
                : <><button className="btn-primary" onClick={applyJson}>적용하기</button><button className="btn-secondary" onClick={closeModal}>취소</button></>
              }
            </div>
          </div>
        </div>
      )}

      {detailWork && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="detail-modal">
            <div className="editor-modal-header">
              <div className="editor-modal-title">DETAIL</div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="detail-modal-body">
              {detailWork.image
                ? <img className="detail-thumb" src={detailWork.image} alt={detailWork.title} />
                : <div className="detail-thumb-placeholder">AT</div>
              }
              <div className="detail-content">
                <div className="detail-tags">{(detailWork.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
                <div className="detail-title">{detailWork.title}</div>
                <div className="detail-meta">
                  <span>{detailWork.generation} · {detailWork.author}</span>
                  <span>{detailWork.date}</span>
                </div>
                <div className="detail-rich" dangerouslySetInnerHTML={{ __html: detailWork.descHtml }} />
              </div>
            </div>
            {isAuth && (
              <div className="detail-actions">
                <button className="btn-danger" onClick={() => deleteWork(detailWork.id)}>삭제</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
