import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  GitFork,
  Workflow,
  CreditCard,
  Settings,
  Bot,
  User,
  Send,
  X,
  Check,
  Copy,
  HelpCircle,
  TrendingUp,
  Activity,
  Search,
  ChevronRight,
  Layers,
  AlertCircle,
  Plus
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente inteligente de **SalesPro CRM**. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      sources: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerActive, setIsServerActive] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Check backend server status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/health');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'healthy') {
            setIsServerActive(true);
            return;
          }
        }
        setIsServerActive(false);
      } catch (err) {
        setIsServerActive(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Send message to FastAPI
  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputText.trim();
    if (!queryText) return;

    if (!textToSend) setInputText('');

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: queryText,
      isUser: true
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText })
      });

      if (!response.ok) throw new Error('Servidor inalcanzable');

      const data = await response.json();

      // Add bot message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.answer,
        isUser: false,
        sources: data.sources || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Lo siento, no pude conectarme con el servidor del Agente IA. Asegúrate de que el backend de FastAPI esté corriendo localmente en `http://localhost:8000` con tus API keys configuradas.',
        isUser: false,
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick copy response
  const copyToClipboard = (text, msgId) => {
    navigator.clipboard.writeText(text).then(() => {
      // Temporary state update for button UI
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, copied: true } : m));
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, copied: false } : m));
      }, 2000);
    });
  };

  // Format source file names nicely
  const getSourceBadgeName = (path) => {
    if (!path) return 'Desconocido';
    return path.split('/').pop();
  };

  // Mock Data for CRM Pages
  const mockContacts = [
    { id: 1, name: 'Alejandro Gómez', email: 'alejandro.gomez@empresa.com', plan: 'Professional', status: 'Activo' },
    { id: 2, name: 'Beatriz Mendoza', email: 'beatriz.m@digital.co', plan: 'Starter', status: 'Activo' },
    { id: 3, name: 'Carlos Villagrán', email: 'c.villagran@startup.mx', plan: 'Enterprise', status: 'Activo' },
    { id: 4, name: 'Diana Parker', email: 'diana@corp-us.com', plan: 'Professional', status: 'Inactivo' },
    { id: 5, name: 'Eduardo Rivas', email: 'eduardo.rivas@cloud.cl', plan: 'Starter', status: 'Activo' }
  ];

  const [pipelineDeals, setPipelineDeals] = useState([
    { id: 'deal-1', title: 'Licencias SalesPro Enterprise', company: 'Corp Latam', value: '$8,500', stage: 'lead' },
    { id: 'deal-2', title: 'Consultoría Onboarding', company: 'Global Tech', value: '$2,400', stage: 'contacted' },
    { id: 'deal-3', title: 'Renovación Plan Anual', company: 'Design Studio', value: '$950', stage: 'proposal' },
    { id: 'deal-4', title: 'Migración de Base de Datos', company: 'Fintech Hub', value: '$4,100', stage: 'negotiation' },
    { id: 'deal-5', title: 'Integración WhatsApp API', company: 'Retail Group', value: '$1,800', stage: 'won' }
  ]);

  const moveDeal = (dealId, nextStage) => {
    setPipelineDeals(prev => prev.map(deal => deal.id === dealId ? { ...deal, stage: nextStage } : deal));
  };

  const [integrations, setIntegrations] = useState([
    { id: 'gmail', name: 'Gmail Integration', desc: 'Sincroniza tus correos y agendas automáticamente.', connected: true },
    { id: 'whatsapp', name: 'WhatsApp Cloud API', desc: 'Envía alertas y plantillas desde el chat del CRM.', connected: false },
    { id: 'stripe', name: 'Stripe Payments', desc: 'Genera enlaces de cobro y controla facturas.', connected: true },
    { id: 'outlook', name: 'Outlook 365', desc: 'Conecta buzones corporativos de Microsoft.', connected: false }
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(prev => prev.map(item => item.id === id ? { ...item, connected: !item.connected } : item));
  };

  // Contact management
  const [contacts, setContacts] = useState(mockContacts);
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    plan: 'Starter',
    status: 'Activo'
  });

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) {
      alert('Nombre y Email son obligatorios');
      return;
    }

    const contact = {
      id: Date.now(),
      name: newContact.name,
      email: newContact.email,
      plan: newContact.plan,
      status: newContact.status
    };

    setContacts(prev => [...prev, contact]);
    setShowNewContactModal(false);
    setNewContact({ name: '', email: '', plan: 'Starter', status: 'Activo' });
  };

  return (
    <div className="crm-app">
      {/* Sidebar Navigation */}
      <aside className="crm-sidebar">
        <div className="crm-logo-area">
          <div className="crm-logo-symbol">SP</div>
          <div className="crm-logo-text">
            <h3>SalesPro</h3>
            <span>Control Panel</span>
          </div>
        </div>

        <nav className="crm-nav">
          <button
            className={`crm-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button
            className={`crm-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <Users size={18} />
            <span>Contactos</span>
          </button>
          <button
            className={`crm-nav-item ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            <GitFork size={18} />
            <span>Embudo Ventas</span>
          </button>
          <button
            className={`crm-nav-item ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <Workflow size={18} />
            <span>Integraciones</span>
          </button>
          <button
            className={`crm-nav-item ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <CreditCard size={18} />
            <span>Planes y Costos</span>
          </button>
        </nav>

        {/* System Health Status */}
        <div className="crm-health-status">
          <div className={`health-dot ${isServerActive ? 'active' : ''}`}></div>
          <div className="health-info">
            <span className="health-label">Agente de IA</span>
            <span className="health-text">{isServerActive ? 'Conectado (DeepSeek)' : 'Desconectado'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="crm-main-content">
        {/* Header Bar */}
        <header className="crm-header-bar">
          <div className="crm-breadcrumb">
            <span className="bc-parent">Administración</span>
            <ChevronRight size={14} className="bc-separator" />
            <span className="bc-current">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          </div>

          <div className="crm-header-actions">
            <button
              className={`agent-shortcut-btn ${isServerActive ? 'glowing' : ''}`}
              onClick={() => setIsChatOpen(true)}
            >
              <Bot size={16} />
              <span>Consultar Asistente IA</span>
            </button>
            <div className="user-profile-badge">
              <div className="avatar">JD</div>
              <span>John Doe</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Views */}
        <div className="crm-view-container">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="view-dashboard fade-in">
              <div className="crm-summary-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="title">Ingresos Mensuales (MRR)</span>
                    <TrendingUp size={16} className="trend-icon" />
                  </div>
                  <h3 className="value">$12,450</h3>
                  <div className="trend-tag positive">+14.2% este mes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="title">Contactos Activos</span>
                    <Users size={16} className="trend-icon" />
                  </div>
                  <h3 className="value">1,234</h3>
                  <div className="trend-tag positive">+5.8% este mes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="title">Tasa de Conversión</span>
                    <Activity size={16} className="trend-icon" />
                  </div>
                  <h3 className="value">3.2%</h3>
                  <div className="trend-tag stable">0.2% vs mes anterior</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="title">En Negociación</span>
                    <Layers size={16} className="trend-icon" />
                  </div>
                  <h3 className="value">42 Tratados</h3>
                  <div className="trend-tag negative">Requiere seguimiento</div>
                </div>
              </div>

              <div className="dashboard-charts-layout">
                <div className="crm-panel main-chart">
                  <h4>Rendimiento Comercial</h4>
                  <p className="panel-desc">Valor estimado del pipeline acumulado por etapas.</p>
                  <div className="simulated-chart-container">
                    <div className="chart-bar-col">
                      <div className="bar" style={{ height: '70%' }}><span className="val">$15K</span></div>
                      <span className="label">Leads</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="bar" style={{ height: '55%' }}><span className="val">$12K</span></div>
                      <span className="label">Contactos</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="bar" style={{ height: '85%' }}><span className="val">$19K</span></div>
                      <span className="label">Propuestas</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="bar" style={{ height: '40%' }}><span className="val">$9K</span></div>
                      <span className="label">Negociación</span>
                    </div>
                    <div className="chart-bar-col">
                      <div className="bar won" style={{ height: '90%' }}><span className="val">$24K</span></div>
                      <span className="label">Ganados</span>
                    </div>
                  </div>
                </div>

                <div className="crm-panel quick-doc-panel">
                  <h4>Preguntas Rápidas sobre el CRM</h4>
                  <p className="panel-desc">Haz clic en una pregunta para consultársela al Agente de IA:</p>
                  <div className="hint-questions-list">
                    <button onClick={() => { setIsChatOpen(true); handleSendMessage('¿Cómo agrego un nuevo contacto?'); }}>
                      ¿Cómo agrego un nuevo contacto?
                    </button>
                    <button onClick={() => { setIsChatOpen(true); handleSendMessage('¿Cuánto cuesta el plan Professional?'); }}>
                      Precios del plan Professional
                    </button>
                    <button onClick={() => { setIsChatOpen(true); handleSendMessage('¿Cómo integro Gmail con el CRM?'); }}>
                      Integración con Gmail
                    </button>
                    <button onClick={() => { setIsChatOpen(true); handleSendMessage('¿Dónde se almacenan mis datos y qué seguridad tienen?'); }}>
                      Políticas de seguridad de datos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="view-contacts crm-panel fade-in">
              <div className="panel-header-actions">
                <div>
                  <h4>Directorio de Contactos</h4>
                  <p className="panel-desc">Lista completa de clientes potenciales e históricos en el CRM.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    className="new-contact-btn"
                    onClick={() => setShowNewContactModal(true)}
                    style={{
                      background: '#4f46e5',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    <Plus size={18} />
                    Nuevo Contacto
                  </button>
                  <div className="search-box">
                    <Search size={16} />
                    <input type="text" placeholder="Buscar contactos..." />
                  </div>
                </div>
              </div>

              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Plan Asignado</th>
                    <th>Estado de Cuenta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(contact => (
                    <tr key={contact.id}>
                      <td className="font-semibold">{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>
                        <span className={`plan-badge ${contact.plan.toLowerCase()}`}>
                          {contact.plan}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${contact.status.toLowerCase() === 'activo' ? 'active' : 'inactive'}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td>
                        <button className="table-action-btn" onClick={() => {
                          setIsChatOpen(true);
                          handleSendMessage(`¿Cuáles son los límites de usuarios y almacenamiento para el plan ${contact.plan}?`);
                        }}>
                          Consultar límites de plan (IA)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="view-pipeline fade-in">
              <div className="pipeline-header">
                <div>
                  <h4>Embudo de Ventas (Pipeline)</h4>
                  <p className="panel-desc">Arrastra o mueve las oportunidades comerciales entre las diferentes etapas de cierre.</p>
                </div>
              </div>

              <div className="kanban-board">
                {['lead', 'contacted', 'proposal', 'negotiation', 'won'].map(stage => {
                  const stageDeals = pipelineDeals.filter(d => d.stage === stage);
                  return (
                    <div className="kanban-column" key={stage}>
                      <div className="column-header">
                        <h5>{stage.charAt(0).toUpperCase() + stage.slice(1)}</h5>
                        <span className="count">{stageDeals.length}</span>
                      </div>
                      <div className="column-cards">
                        {stageDeals.map(deal => (
                          <div className="deal-card" key={deal.id}>
                            <h6>{deal.title}</h6>
                            <p className="company">{deal.company}</p>
                            <div className="deal-footer">
                              <span className="value">{deal.value}</span>
                              <select
                                className="stage-select"
                                value={deal.stage}
                                onChange={(e) => moveDeal(deal.id, e.target.value)}
                              >
                                <option value="lead">Lead</option>
                                <option value="contacted">Contactado</option>
                                <option value="proposal">Propuesta</option>
                                <option value="negotiation">Negociación</option>
                                <option value="won">Ganado</option>
                              </select>
                            </div>
                          </div>
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="empty-column">Sin tratos</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="view-integrations crm-panel fade-in">
              <h4>Centro de Integraciones</h4>
              <p className="panel-desc">Sincroniza y expande la funcionalidad del CRM activando módulos externos.</p>

              <div className="integrations-grid">
                {integrations.map(item => (
                  <div className={`integration-card ${item.connected ? 'connected' : ''}`} key={item.id}>
                    <div className="card-header">
                      <div className="integration-icon">
                        {item.id.charAt(0).toUpperCase()}
                      </div>
                      <button
                        className={`toggle-btn ${item.connected ? 'disconnect' : 'connect'}`}
                        onClick={() => toggleIntegration(item.id)}
                      >
                        {item.connected ? 'Desconectar' : 'Conectar'}
                      </button>
                    </div>
                    <h5>{item.name}</h5>
                    <p>{item.desc}</p>
                    {item.connected && (
                      <span className="connection-badge">Activo</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PRICING */}
          {activeTab === 'pricing' && (
            <div className="view-pricing fade-in">
              <div className="pricing-title">
                <h4>Planes y Tarifas - SalesPro CRM</h4>
                <p className="panel-desc">Datos extraídos de las tablas del CRM indexadas por la base de datos de IA.</p>
              </div>

              <div className="pricing-cards-container">
                <div className="price-card">
                  <span className="badge">Básico</span>
                  <h4>Starter</h4>
                  <div className="price">$29 <span>/ mes</span></div>
                  <ul>
                    <li>1 Usuario incluido</li>
                    <li>Hasta 1,000 Contactos</li>
                    <li>10 GB Almacenamiento</li>
                    <li>Soporte por Email</li>
                    <li>API básica (50 calls/min)</li>
                  </ul>
                  <button onClick={() => {
                    setIsChatOpen(true);
                    handleSendMessage('¿Qué soporte y características tiene el plan Starter?');
                  }}>Preguntar a la IA sobre Starter</button>
                </div>

                <div className="price-card popular">
                  <span className="badge popular-badge">Más Elegido</span>
                  <h4>Professional</h4>
                  <div className="price">$79 <span>/ mes</span></div>
                  <ul>
                    <li>Hasta 10 Usuarios</li>
                    <li>Hasta 10,000 Contactos</li>
                    <li>50 GB Almacenamiento</li>
                    <li>Soporte 24/7 (Chat y Email)</li>
                    <li>Integraciones ilimitadas</li>
                    <li>API avanzada (100 calls/min)</li>
                  </ul>
                  <button onClick={() => {
                    setIsChatOpen(true);
                    handleSendMessage('¿Cuánto cuesta y qué incluye el plan Professional mensualmente?');
                  }}>Preguntar a la IA sobre Professional</button>
                </div>

                <div className="price-card">
                  <span className="badge">Completo</span>
                  <h4>Enterprise</h4>
                  <div className="price">$199 <span>/ mes</span></div>
                  <ul>
                    <li>Usuarios Ilimitados</li>
                    <li>Contactos Ilimitados</li>
                    <li>100 GB Almacenamiento</li>
                    <li>Soporte Prioritario con Gestor Dedicado</li>
                    <li>SLA de disponibilidad del 99.9%</li>
                    <li>API avanzada y webhooks</li>
                  </ul>
                  <button onClick={() => {
                    setIsChatOpen(true);
                    handleSendMessage('¿Cuáles son las ventajas legales y técnicas del plan Enterprise?');
                  }}>Preguntar a la IA sobre Enterprise</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          className={`floating-agent-trigger ${isServerActive ? 'glowing' : ''}`}
          onClick={() => setIsChatOpen(true)}
        >
          <Bot size={28} />
          {isServerActive && <span className="active-dot"></span>}
        </button>
      )}

      {/* Chat Agent Drawer */}
      <div className={`chat-agent-drawer ${isChatOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="bot-info">
            <div className="bot-icon">
              <Bot size={20} />
            </div>
            <div>
              <h5>CRM Assistant</h5>
              <div className="bot-status">
                <span className={`status-dot ${isServerActive ? 'connected' : ''}`}></span>
                <span className="status-text">{isServerActive ? 'Agente Activo (DeepSeek)' : 'Agente Offline'}</span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsChatOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Message Container */}
        <div className="drawer-messages">
          {messages.map(msg => (
            <div className={`chat-row ${msg.isUser ? 'user' : 'bot'}`} key={msg.id}>
              <div className="chat-avatar">
                {msg.isUser ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="chat-bubble-wrapper">
                <div
                  className="chat-bubble"
                  dangerouslySetInnerHTML={{
                    // Support basic markdown like bold and list parsing
                    __html: parseSimpleMarkdown(msg.text)
                  }}
                />

                {/* Sources list */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="chat-sources">
                    <span className="src-label">Fuentes:</span>
                    {[...new Set(msg.sources)].map((src, i) => (
                      <span
                        className="src-badge"
                        key={i}
                        onClick={() => handleSendMessage(`¿Qué información del archivo ${getSourceBadgeName(src)} usaste?`)}
                      >
                        {getSourceBadgeName(src)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions (Copy response) */}
                {!msg.isUser && (
                  <div className="chat-bubble-actions">
                    <button className="copy-btn" onClick={() => copyToClipboard(msg.text, msg.id)}>
                      {msg.copied ? (
                        <>
                          <Check size={12} />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="chat-row bot">
              <div className="chat-avatar">
                <Bot size={14} />
              </div>
              <div className="typing-bubbles">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions in Drawer */}
        <div className="drawer-suggested">
          <span className="label">Preguntas sugeridas:</span>
          <div className="suggested-chips">
            <button onClick={() => handleSendMessage('¿Cómo agrego un nuevo contacto?')}>¿Cómo agrego contactos?</button>
            <button onClick={() => handleSendMessage('¿Cuánto cuesta el plan Professional?')}>Precio Professional</button>
            <button onClick={() => handleSendMessage('¿Qué integraciones están disponibles?')}>Integraciones</button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="drawer-input-container">
          <input
            type="text"
            placeholder="Pregúntame sobre el CRM..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Modal: New Contact */}
      {showNewContactModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewContactModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1f3a',
              borderRadius: '16px',
              padding: '32px',
              minWidth: '450px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'white', margin: 0 }}>Nuevo Contacto</h3>
              <button
                onClick={() => setShowNewContactModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1425',
                    border: '1px solid #2d3548',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="juan.perez@empresa.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1425',
                    border: '1px solid #2d3548',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Plan Asignado
                </label>
                <select
                  value={newContact.plan}
                  onChange={(e) => setNewContact({ ...newContact, plan: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1425',
                    border: '1px solid #2d3548',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Estado
                </label>
                <select
                  value={newContact.status}
                  onChange={(e) => setNewContact({ ...newContact, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f1425',
                    border: '1px solid #2d3548',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={handleAddContact}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Guardar Contacto
                </button>
                <button
                  onClick={() => setShowNewContactModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    color: '#9ca3af',
                    border: '1px solid #2d3548',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple helper to parse basic markdown tags safely
function parseSimpleMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Bullets (* item or - item)
  // Simple paragraph and bullet parser
  const lines = html.split('\n');
  let inList = false;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      result.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      if (line) {
        result.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) {
    result.push('</ul>');
  }

  return result.join('');
}

export default App;
