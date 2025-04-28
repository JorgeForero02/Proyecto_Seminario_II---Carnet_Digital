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
import "../styles/AsistenciasPage.css"; // We'll create this CSS file

const AsistenciasPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("materias");

  // Estados para materias y horarios
  const [materias, setMaterias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);

  // Estados para estudiantes (para docentes)
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchEstudiante, setSearchEstudiante] = useState("");

  // Estados para registro de asistencia
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);
  const [asistenciaData, setAsistenciaData] = useState({
    horario_clase_id: null,
    fecha: new Date().toISOString().split("T")[0],
    estudiantes: [],
  });

  // Estados para ver asistencias
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasLoading, setAsistenciasLoading] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);

  // Estados para filtros de asistencia
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Estados para edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsistencia, setEditingAsistencia] = useState(null);

  // Estados para eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAsistencia, setDeletingAsistencia] = useState(null);

  // Cargar materias del usuario al inicio
  useEffect(() => {
    const cargarMaterias = async () => {
      setLoading(true);
      try {
        let response;
        if (user.roles.includes("ESTUDIANTE")) {
          response = await api.get("/estudiante-materias");
          const detalle = await Promise.all(
            response.data.map(async (em) => {
              const [mRes, pRes] = await Promise.all([
                api.get(`/materias/${em.materia_id}`),
                api.get(`/periodos/${em.periodo_id}`),
              ]);
              return { ...em, materia: mRes.data, periodo: pRes.data };
            })
          );
          setMaterias(detalle);
        } else if (user.roles.includes("DOCENTE")) {
          response = await api.get("/docente-materias");
          const detalle = await Promise.all(
            response.data.map(async (dm) => {
              const [mRes, pRes] = await Promise.all([
                api.get(`/materias/${dm.materia_id}`),
                api.get(`/periodos/${dm.periodo_id}`),
              ]);
              return { ...dm, materia: mRes.data, periodo: pRes.data };
            })
          );
          setMaterias(detalle);
        }
      } catch (err) {
        setError("Error cargando materias: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) cargarMaterias();
  }, [user]);

  // Cargar horarios cuando se selecciona una materia
  const cargarHorarios = async (materiaId, periodoId) => {
    try {
      let data = [];
      if (user.roles.includes("DOCENTE")) {
        const dmRes = await api.get("/docente-materias", {
          params: {
            docente_id: user.id,
            materia_id: materiaId,
            periodo_id: periodoId,
          },
        });
        if (dmRes.data.length) {
          const idDM = dmRes.data[0].id;
          const hRes = await api.get("/horario-clases", {
            params: { docente_materia_id: idDM },
          });
          data = hRes.data;
        }
      } else if (user.roles.includes("ESTUDIANTE")) {
        const emRes = await api.get("/estudiante-materias", {
          params: { materia_id: materiaId, periodo_id: periodoId },
        });
        const promises = emRes.data.map((em) =>
          api.get("/horario-clases", { params: { docente_materia_id: em.id } })
        );
        const results = await Promise.all(promises);
        data = results.flatMap((r) => r.data);
      }
      setHorarios(data);
    } catch (err) {
      setError("Error cargando horarios: " + err.message);
    }
  };

  // Cargar estudiantes para un materia+periodo (docentes)
  const cargarEstudiantes = async (materiaId, periodoId) => {
    if (!user.roles.includes("DOCENTE")) return;
    try {
      const emRes = await api.get("/estudiante-materias", {
        params: { materia_id: materiaId, periodo_id: periodoId },
      });

      const detalle = await Promise.all(
        emRes.data.map(async (em) => {
          const uRes = await api.get(`/usuarios/${em.estudiante_id}`);
          return { estudiante_id: em.estudiante_id, estudiante: uRes.data };
        })
      );
      setEstudiantes(detalle);
    } catch (err) {
      setError("Error cargando estudiantes: " + err.message);
    }
  };

  // Cargar asistencias para un horario específico
  const cargarAsistencias = async (horarioId) => {
    setAsistenciasLoading(true);
    try {
      const aRes = await api.get("/asistencia-clases", {
        params: { horario_clase_id: horarioId },
      });
      const detalle = await Promise.all(
        aRes.data.map(async (a) => {
          const uRes = await api.get(`/usuarios/${a.estudiante_id}`);
          return { ...a, estudiante: uRes.data };
        })
      );
      setAsistencias(detalle);
      setSelectedHorario(horarioId);
    } catch (err) {
      setError("Error cargando asistencias: " + err.message);
    } finally {
      setAsistenciasLoading(false);
    }
  };

  // Seleccionar materia
  const handleMateriaSelect = async (m) => {
    setSelectedMateria(m);
    await cargarHorarios(m.materia_id, m.periodo_id);
    if (user.roles.includes("DOCENTE")) {
      await cargarEstudiantes(m.materia_id, m.periodo_id);
    }
    setActiveSection("horarios");
  };

  // Preparar modal registro (docentes)
  const prepararRegistroAsistencia = (horario) => {
    setAsistenciaData({
      horario_clase_id: horario.id,
      fecha: new Date().toISOString().split("T")[0],
      estudiantes: estudiantes.map((e) => ({
        estudiante_id: e.estudiante_id,
        presente: true,
      })),
    });
    setShowRegistrarModal(true);
  };

  // Manejar cambios de asistencia en modal
  const handleAsistenciaChange = (i, pres) => {
    const arr = [...asistenciaData.estudiantes];
    arr[i].presente = pres;
    setAsistenciaData({ ...asistenciaData, estudiantes: arr });
  };
  // QUÉ AÑADIR
  const handleAsistenciaChangeById = (estudiante_id, presente) => {
    setAsistenciaData(current => ({
      ...current,
      estudiantes: current.estudiantes.map(e =>
        e.estudiante_id === estudiante_id
          ? { ...e, presente }
          : e
      )
    }));
  };


  // Guardar asistencias
  const guardarAsistencia = async () => {
    try {
      await Promise.all(
        asistenciaData.estudiantes.map((e) =>
          api.post("/asistencia-clases", {
            estudiante_id: e.estudiante_id,
            horario_clase_id: asistenciaData.horario_clase_id,
            fecha: asistenciaData.fecha,
            estado: e.presente ? "PRESENTE" : "AUSENTE",
          })
        )
      );
      setShowRegistrarModal(false);
      await cargarAsistencias(asistenciaData.horario_clase_id);
      setActiveSection("asistencias");
    } catch (err) {
      setError("Error guardando asistencias: " + err.message);
    }
  };

  // Actualizar asistencia
  const actualizarAsistencia = async () => {
    try {
      await api.put(`/asistencia-clases/${editingAsistencia.id}`, {
        estado: editingAsistencia.estado
      });
      setShowEditModal(false);
      await cargarAsistencias(selectedHorario);
    } catch (err) {
      setError("Error actualizando asistencia: " + err.message);
    }
  };

  // Eliminar asistencia
  const eliminarAsistencia = async () => {
    try {
      await api.delete(`/asistencia-clases/${deletingAsistencia.id}`);
      setShowDeleteModal(false);
      await cargarAsistencias(selectedHorario);
    } catch (err) {
      setError("Error eliminando asistencia: " + err.message);
    }
  };

  // Preparar modal edición
  const prepararEdicion = (asistencia) => {
    setEditingAsistencia(asistencia);
    setShowEditModal(true);
  };

  // Preparar modal eliminación
  const prepararEliminacion = (asistencia) => {
    setDeletingAsistencia(asistencia);
    setShowDeleteModal(true);
  };

  // Exportar asistencias a CSV
  const exportarAsistencias = () => {
    // Filtrar asistencias según los filtros aplicados
    const filteredAsistencias = filtrarAsistencias();

    // Crear contenido CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Estudiante,Fecha,Estado\n";

    filteredAsistencias.forEach(a => {
      const row = [
        `${a.estudiante.nombres} ${a.estudiante.apellidos}`,
        new Date(a.fecha).toLocaleDateString(),
        a.estado
      ].join(",");
      csvContent += row + "\n";
    });

    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `asistencias_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrar asistencias según filtros aplicados
  const filtrarAsistencias = () => {
    return asistencias.filter(a => {
      // Filtro por fecha
      const fechaMatch = dateFilter ?
        new Date(a.fecha).toISOString().split("T")[0] === dateFilter : true;

      // Filtro por estado
      const estadoMatch = statusFilter === "TODOS" ?
        true : a.estado === statusFilter;

      return fechaMatch && estadoMatch;
    });
  };

  // Filtrar estudiantes por búsqueda
  const filtrarEstudiantes = () => {
    if (!searchEstudiante) return estudiantes;

    return estudiantes.filter(e =>
      `${e.estudiante.nombres} ${e.estudiante.apellidos}`
        .toLowerCase()
        .includes(searchEstudiante.toLowerCase())
    );
  };

  // Calcular estadísticas de asistencia
  const calcularEstadisticas = () => {
    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === "PRESENTE").length;
    const ausentes = total - presentes;

    return {
      total,
      presentes,
      ausentes,
      porcentajePresentes: total > 0 ? Math.round((presentes / total) * 100) : 0,
      porcentajeAusentes: total > 0 ? Math.round((ausentes / total) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-container">
          <Spinner animation="border" variant="danger" />
          <span className="ms-3">Cargando datos...</span>
        </div>
      </div>
    );
  }

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
          onClick={() => selectedMateria && setActiveSection('asistencias')}
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
                <div
                  className={`materia-card ${selectedMateria?.materia_id === m.materia_id ? "selected" : ""
                    }`}
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
                </div>
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
                            onClick={() => {
                              cargarAsistencias(h.id);
                              setActiveSection("asistencias");
                            }}
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
      )}         {/* cierra activeSection === "asistencias" */}


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
                // Buscamos el objeto de asistencia con este ID
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
