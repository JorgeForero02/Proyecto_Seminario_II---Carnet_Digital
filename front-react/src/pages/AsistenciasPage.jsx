import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import {
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Container,
  ProgressBar
} from "react-bootstrap";
import {
  Calendar,
  Users,
  CheckSquare,
  Check,
  X,
  Clock,
  AlertCircle,
  BookOpen,
  Calendar as CalendarIcon,
  FileText,
  ChevronRight,
  Edit,
  Trash2,
  Filter,
  Download,
  PieChart,
  Search,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AsistenciasPage.css";

const AsistenciasPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("materias");

  // Datos principales
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasLoading, setAsistenciasLoading] = useState(false);

  // Filtros
  const [searchEstudiante, setSearchEstudiante] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Modales y edición
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [asistenciaData, setAsistenciaData] = useState({
    horario_clase_id: null,
    fecha: "",
    estudiantes: []
  });
  const [editingAsistencia, setEditingAsistencia] = useState(null);
  const [deletingAsistencia, setDeletingAsistencia] = useState(null);

  // Carga materias para el usuario
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        if (user.roles.includes("DOCENTE")) {
          // Llamada al endpoint de estudiante-materias
          const res = await api.get(`/docentes/${user.id}/materias`);
          // El API devuelve [{ estado, materia: {…}, periodo: {…} }, …]
          // Lo adaptamos para que coincida con el shape de 'materias'
          const detalle = res.data.map(em => ({
            materia_id: em.materia.id,
            periodo_id: em.periodo.id,
            materia: em.materia,
            periodo: em.periodo
          }));
          setMaterias(detalle);
        }
        else if (user.roles.includes("ESTUDIANTE")) {
          // Llamada al endpoint de estudiante-materias
          const res = await api.get(`/estudiantes/${user.id}/materias`);
          // El API devuelve [{ estado, materia: {…}, periodo: {…} }, …]
          // Lo adaptamos para que coincida con el shape de 'materias'
          const detalle = res.data.map(em => ({
            materia_id: em.materia.id,
            periodo_id: em.periodo.id,
            materia: em.materia,
            periodo: em.periodo
          }));
          setMaterias(detalle);
        } else {
          setMaterias([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) cargar();
  }, [user]);

  // Cuando selecciona materia
  const handleMateriaSelect = async (m) => {
    setSelectedMateria(m);

    if (user.roles.includes("DOCENTE")) {
      setActiveSection("horarios");
      try {
        const hRes = await api.get(`/docentes/${user.id}/materias/${m.materia_id}/horario`);
        setHorarios(hRes.data);

        // ————— Aquí empieza el bloque corregido —————
        const eRes = await api.get(
          `/docentes/${user.id}/materias/${m.materia_id}/estudiantes`
        );

        // 1) extraemos el array que puede venir en data o en data.estudiantes
        const raw = Array.isArray(eRes.data)
          ? eRes.data
          : eRes.data.estudiantes || [];

        // 2) lo mapeamos al shape que tu UI espera
        const listaFormateada = raw.map(item => ({
          estudiante_id: item.id,
          estudiante: {
            nombres: item.Usuario?.nombres || "",
            apellidos: item.Usuario?.apellidos || ""
          }
        }));

        setEstudiantes(listaFormateada);
        // ————— Aquí termina el bloque corregido —————

      } catch (err) {
        setError(err.message);
      }
    }
    else if (user.roles.includes("ESTUDIANTE")) {
      // Para estudiantes: cargamos primero el horario…
      setActiveSection("horarios");
      try {
        const hRes = await api.get(`/estudiantes/${user.id}/horario`);
        setHorarios(hRes.data);
        // …y luego sus propias asistencias para la materia seleccionada
        await cargarAsistencias();
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Otros roles (si aplica)
      setMaterias([]);
    }
  };


  // Cargar asistencias (por materia)
  const cargarAsistencias = async () => {
    if (!selectedMateria) return;
    setAsistenciasLoading(true);
    try {
      let res;
      let rawAsistencias;

      if (user.roles.includes("DOCENTE")) {
        // Llamada para docentes
        res = await api.get(
          `/docentes/${user.id}/materias/${selectedMateria.materia_id}/asistencias`
        );
        rawAsistencias = res.data.asistencias;

        const mapped = rawAsistencias.map(a => ({
          id: a.id,
          fecha: a.fecha,
          estado: a.estado,
          estudiante: a.Estudiante.Usuario,
          horario_clase: a.HorarioClase
        }));

        setAsistencias(mapped);

      } else if (user.roles.includes("ESTUDIANTE")) {
        // Llamada para estudiantes
        res = await api.get(
          `/estudiantes/${user.id}/materias/${selectedMateria.materia_id}/asistencias-clases`
        );
        rawAsistencias = res.data.asistencias;

        // Mapeamos e incluimos al propio usuario en la propiedad 'estudiante'
        const mapped = rawAsistencias.map(a => ({
          id: a.id,
          fecha: a.fecha,
          estado: a.estado,
          estudiante: {
            nombres: user.nombres,      // o user.name según tu contexto
            apellidos: user.apellidos
          },
          horario_clase: a.HorarioClase
        }));

        setAsistencias(mapped);
      }

      setActiveSection("asistencias");
    } catch (err) {
      setError(err.message);
    } finally {
      setAsistenciasLoading(false);
    }
  };


  // Registro de asistencia
  const prepararRegistro = (h) => {
    const estudiantesData = estudiantes.map(e => ({
      estudiante_id: e.estudiante_id,
      presente: true
    }));
    setAsistenciaData({
      horario_clase_id: h.id,
      fecha: new Date().toISOString().split('T')[0],
      estudiantes: estudiantesData
    });
    setShowRegistrarModal(true);
  };

  const handleAsistenciaChangeById = (estudianteId, presente) => {
    setAsistenciaData(prev => ({
      ...prev,
      estudiantes: prev.estudiantes.map(e =>
        e.estudiante_id === estudianteId ? { ...e, presente } : e
      )
    }));
  };

  const guardarAsistencia = async () => {
    try {
      const registros = asistenciaData.estudiantes.map(e => ({
        estudiante_id: e.estudiante_id,
        horario_clase_id: asistenciaData.horario_clase_id,
        fecha: asistenciaData.fecha,
        estado: e.presente ? "PRESENTE" : "AUSENTE"
      }));
      await Promise.all(registros.map(r => api.post("/asistencia-clases", r)));
      setShowRegistrarModal(false);
      cargarAsistencias();
    } catch (err) {
      setError(err.message);
    }
  };

  // Funciones de preparación para modales
  const prepararRegistroAsistencia = (h) => {
    prepararRegistro(h);
  };

  const prepararEdicion = (a) => {
    setEditingAsistencia(a);
    setShowEditModal(true);
  };

  const prepararEliminacion = (a) => {
    setDeletingAsistencia(a);
    setShowDeleteModal(true);
  };

  // Editar asistencia
  const actualizarAsistencia = async () => {
    try {
      await api.put(`/asistencia-clases/${editingAsistencia.id}`, { estado: editingAsistencia.estado });
      setShowEditModal(false);
      cargarAsistencias();
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar asistencia
  const eliminarAsistencia = async () => {
    try {
      await api.delete(`/asistencia-clases/${deletingAsistencia.id}`);
      setShowDeleteModal(false);
      cargarAsistencias();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtros
  const filtrarEstudiantes = () => {
    if (!Array.isArray(estudiantes)) return [];
    if (!searchEstudiante) return estudiantes;
    return estudiantes.filter(e =>
      `${e.estudiante.nombres} ${e.estudiante.apellidos}`
        .toLowerCase()
        .includes(searchEstudiante.toLowerCase())
    );
  };

  const filtrarAsistencias = () => asistencias.filter(a => {
    const fDate = dateFilter ? a.fecha === dateFilter : true;
    const fStatus = statusFilter === "TODOS" ? true : a.estado === statusFilter;
    return fDate && fStatus;
  });

  // Estadísticas
  const calcularEstadisticas = () => {
    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === "PRESENTE").length;
    const ausentes = total - presentes;
    const porcentajePresentes = total ? Math.round((presentes / total) * 100) : 0;
    return { total, presentes, ausentes, porcentajePresentes };
  };

  // Exportar asistencias
  const exportarAsistencias = () => {
    const data = filtrarAsistencias();
    const csv = [
      ['Estudiante', 'Fecha', 'Estado'],
      ...data.map(a => [
        `${a.estudiante.nombres} ${a.estudiante.apellidos}`,
        new Date(a.fecha).toLocaleDateString(),
        a.estado
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistencias_${selectedMateria?.materia.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading"><Spinner animation="border" /> Cargando...</div>;

  return (
    <Container fluid className="py-4 asistencias-container">
      <div className="section-header">
        <h2 className="text-danger mb-4">
          <Calendar className="me-2" size={28} /> Gestión de Asistencias
        </h2>
        <div className="section-breadcrumb">
          {selectedMateria && (
            <>
              <span className="breadcrumb-item">
                <BookOpen size={16} className="me-1" /> {selectedMateria.materia.nombre}
              </span>
              <ChevronRight size={14} className="mx-2 text-muted" />
            </>
          )}
          <span className="breadcrumb-active">
            {activeSection === 'materias' && 'Mis Materias'}
            {activeSection === 'horarios' && 'Horarios'}
            {activeSection === 'asistencias' && 'Asistencias'}
          </span>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          className="d-flex align-items-center"
        >
          <AlertCircle className="me-2" size={20} />
          <div>{error}</div>
        </Alert>
      )}

      <div className="navigation-tabs">
        <Button
          variant={activeSection === 'materias' ? 'danger' : 'outline-danger'}
          className="tab-button"
          onClick={() => setActiveSection('materias')}
        >
          <BookOpen size={18} className="me-2" /> Mis Materias
        </Button>
        <Button
          variant={activeSection === 'horarios' ? 'danger' : 'outline-danger'}
          className={`tab-button ${!selectedMateria ? 'disabled' : ''}`}
          onClick={() => selectedMateria && setActiveSection('horarios')}
          disabled={!selectedMateria}
        >
          <CalendarIcon size={18} className="me-2" /> Horarios
        </Button>
        <Button
          variant={activeSection === 'asistencias' ? 'danger' : 'outline-danger'}
          className={`tab-button ${!selectedMateria ? 'disabled' : ''}`}
          onClick={() => selectedMateria && cargarAsistencias()}
          disabled={!selectedMateria}
        >
          <FileText size={18} className="me-2" /> Asistencias
        </Button>
      </div>

      {/* Sección Materias */}
      {activeSection === "materias" && (
        <div className="section-content">
          <Row className="row-cols-1 row-cols-md-3 g-4 mt-3">
            {materias.map((m) => (
              <Col key={`${m.materia_id}-${m.periodo_id}`}>
                <Button
                  variant="light"
                  className={`materia-card ${selectedMateria?.materia_id === m.materia_id ? "selected" : ""}`}
                  onClick={() => handleMateriaSelect(m)}
                >
                  <div className="materia-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="materia-info">
                    <h4 className="materia-title">{m.materia.nombre}</h4>
                    <div className="materia-code">{m.materia.codigo}</div>
                    <Badge bg="danger" className="materia-periodo">
                      {m.periodo.nombre}
                    </Badge>
                  </div>
                </Button>
              </Col>
            ))}
            {materias.length === 0 && (
              <Col>
                <Alert variant="info" className="d-flex align-items-center">
                  <AlertCircle size={20} className="me-2" />
                  No tienes materias asignadas.
                </Alert>
              </Col>
            )}
          </Row>
        </div>
      )}

      {/* Sección Horarios */}
      {activeSection === "horarios" && (
        <div className="section-content">

          <div className="card shadow-sm mb-4 mt-3">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <Clock size={18} className="me-2" /> Horarios de Clase
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover custom-table mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Día</th>
                      <th scope="col">Horario</th>
                      <th scope="col">Ubicación</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horarios.map((h) => (
                      <tr key={h.id}>
                        <td>
                          <Badge
                            bg={["", "primary", "success", "info", "warning", "danger", "dark", "secondary"][h.dia_semana]}
                            className="dia-badge"
                          >
                            {["", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][h.dia_semana]}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Clock size={16} className="me-2 text-muted" />
                            <span>{h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}</span>
                          </div>
                        </td>
                        <td>{h.ubicacion}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 btn-icon"
                            onClick={() => cargarAsistencias()}
                          >
                            <FileText size={16} /> Ver
                          </Button>
                          {user.roles.includes("DOCENTE") && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="btn-icon"
                              onClick={() => prepararRegistroAsistencia(h)}
                            >
                              <CheckSquare size={16} /> Registrar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {horarios.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <div className="empty-state">
                            <Calendar size={32} className="text-muted mb-2" />
                            <p className="mb-0">No hay horarios disponibles para esta materia.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sección estudiantes para docentes */}
          {user.roles.includes("DOCENTE") && (
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <Users size={18} className="me-2" /> Estudiantes Matriculados
                </h5>
                <div className="student-search">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Search size={18} />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Buscar estudiante..."
                      className="border-start-0"
                      value={searchEstudiante}
                      onChange={(e) => setSearchEstudiante(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover custom-table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrarEstudiantes().map((e, index) => (
                        <tr key={e.estudiante_id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="student-avatar">
                                {e.estudiante.nombres.charAt(0)}{e.estudiante.apellidos.charAt(0)}
                              </div>
                              <div className="ms-2">
                                {e.estudiante.nombres} {e.estudiante.apellidos}
                              </div>
                            </div>
                          </td>
                          <td>{e.estudiante_id}</td>
                        </tr>
                      ))}
                      {estudiantes.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            <div className="empty-state">
                              <Users size={32} className="text-muted mb-2" />
                              <p className="mb-0">No hay estudiantes matriculados en esta materia.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      {estudiantes.length > 0 && filtrarEstudiantes().length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            <div className="empty-state">
                              <Search size={32} className="text-muted mb-2" />
                              <p className="mb-0">No se encontraron estudiantes que coincidan con la búsqueda.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sección Asistencias */}
      {activeSection === "asistencias" && (
        <div className="section-content">
          <div className="card shadow-sm mb-4 mt-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap">
              <h5 className="mb-0">
                <CheckSquare size={18} className="me-2" /> Registro de Asistencias
              </h5>
              <div className="d-flex gap-2 filter-controls">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white">
                    <Calendar size={16} />
                  </span>
                  <Form.Control
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    placeholder="Filtrar por fecha"
                  />
                </div>
                <Form.Select
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option value="TODOS">Todos</option>
                  <option value="PRESENTE">Presentes</option>
                  <option value="AUSENTE">Ausentes</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setDateFilter("");
                    setStatusFilter("TODOS");
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={exportarAsistencias}
                >
                  <Download size={16} className="me-1" /> Exportar
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              {asistenciasLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="danger" />
                  <p className="mt-2">Cargando registros de asistencia...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover custom-table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Estudiante</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Estado</th>
                        {user.roles.includes("DOCENTE") && (
                          <th scope="col">Acciones</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filtrarAsistencias().map((a) => (
                        <tr key={a.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="student-avatar">
                                {a.estudiante.nombres.charAt(0)}{a.estudiante.apellidos.charAt(0)}
                              </div>
                              <div className="ms-2">
                                {a.estudiante.nombres} {a.estudiante.apellidos}
                              </div>
                            </div>
                          </td>
                          <td>{new Date(a.fecha).toLocaleDateString()}</td>
                          <td>
                            {a.estado === "PRESENTE" ? (
                              <Badge bg="success" className="status-badge">
                                <Check size={14} /> Presente
                              </Badge>
                            ) : (
                              <Badge bg="danger" className="status-badge">
                                <X size={14} /> Ausente
                              </Badge>
                            )}
                          </td>
                          {user.roles.includes("DOCENTE") && (
                            <td>
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="me-2 btn-icon-sm"
                                onClick={() => prepararEdicion(a)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="btn-icon-sm"
                                onClick={() => prepararEliminacion(a)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {asistencias.length === 0 && (
                        <tr>
                          <td colSpan={user.roles.includes("DOCENTE") ? 4 : 3} className="text-center py-4">
                            <div className="empty-state">
                              <FileText size={32} className="text-muted mb-2" />
                              <p className="mb-0">No hay registros de asistencia para este horario.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      {asistencias.length > 0 && filtrarAsistencias().length === 0 && (
                        <tr>
                          <td colSpan={user.roles.includes("DOCENTE") ? 4 : 3} className="text-center py-4">
                            <div className="empty-state">
                              <Filter size={32} className="text-muted mb-2" />
                              <p className="mb-0">No hay registros que coincidan con los filtros aplicados.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Resumen de asistencias */}
          {asistencias.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <PieChart size={18} className="me-2" /> Resumen de Asistencias
                </h5>
              </div>
              <div className="card-body">
                <Row>
                  <Col md={6}>
                    <div className="stats-container">
                      <div className="stats-item">
                        <div className="stats-label">Total de clases</div>
                        <div className="stats-value">{calcularEstadisticas().total}</div>
                      </div>
                      <div className="stats-item">
                        <div className="stats-label">Asistencias</div>
                        <div className="stats-value text-success">{calcularEstadisticas().presentes}</div>
                      </div>
                      <div className="stats-item">
                        <div className="stats-label">Ausencias</div>
                        <div className="stats-value text-danger">{calcularEstadisticas().ausentes}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="progress-container">
                      <div className="progress-label d-flex justify-content-between">
                        <span>Porcentaje de asistencia</span>
                        <span>{calcularEstadisticas().porcentajePresentes}%</span>
                      </div>
                      <ProgressBar
                        now={calcularEstadisticas().porcentajePresentes}
                        label={`${calcularEstadisticas().porcentajePresentes}%`}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      {/* 1) Modal de Registro */}
      <Modal show={showRegistrarModal} onHide={() => setShowRegistrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Asistencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={asistenciaData.fecha}
              onChange={e => setAsistenciaData({ ...asistenciaData, fecha: e.target.value })}
            />
          </Form.Group>

          <table className="table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Presente</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(e => {
                const a = asistenciaData.estudiantes.find(x => x.estudiante_id === e.estudiante_id);
                return (
                  <tr key={e.estudiante_id}>
                    <td>{e.estudiante.nombres} {e.estudiante.apellidos}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={a?.presente || false}
                        onChange={evt =>
                          handleAsistenciaChangeById(
                            e.estudiante_id,
                            evt.target.checked
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegistrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={guardarAsistencia}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>


      {/* 2) Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Estado de Asistencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={editingAsistencia?.estado || "PRESENTE"}
              onChange={e => setEditingAsistencia({ ...editingAsistencia, estado: e.target.value })}
            >
              <option value="PRESENTE">Presente</option>
              <option value="AUSENTE">Ausente</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="info" onClick={actualizarAsistencia}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

      {/* 3) Modal de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la asistencia de <strong>{deletingAsistencia?.estudiante.nombres} {deletingAsistencia?.estudiante.apellidos}</strong> del día <strong>{new Date(deletingAsistencia?.fecha).toLocaleDateString()}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={eliminarAsistencia}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default AsistenciasPage;
