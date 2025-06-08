import React, { useState, useEffect, use } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import {
    Button,
    Modal,
    Form,
    Spinner,
    Alert,
    Row,
    Col,
    Container,
    Table,
} from "react-bootstrap";
import {
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Clock,
    PlusSquare,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AsistenciasPage.css";

const diaOptions = [
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
    "DOMINGO",
];

const diaAbbrev = {
    LUNES: "Lun",
    MARTES: "Mar",
    MIERCOLES: "Mié",
    JUEVES: "Jue",
    VIERNES: "Vie",
    SABADO: "Sáb",
    DOMINGO: "Dom",
};

const AsesoriasPage = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("materias");

    const [materias, setMaterias] = useState([]);
    const [selMat, setSelMat] = useState(null);

    const [asesorias, setAsesorias] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [asistencias, setAsistencias] = useState([]);

    const [tipos, setTipos] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    // Modal Asesoría
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ tipo_asesoria_id: "", periodo_id: "" });

    // Modal Horario
    const [showHorarioModal, setShowHorarioModal] = useState(false);
    const [horarioEditing, setHorarioEditing] = useState(null);
    const [horarioForm, setHorarioForm] = useState({
        asesoria_id: "",
        dia_semana: "",
        hora_inicio: "",
        hora_fin: "",
        ubicacion: "",
    });

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [tr, pr] = await Promise.all([
                    api.get("/tipos-asesoria"),
                    api.get("/periodos"),
                ]);
                setTipos(tr.data);
                setPeriodos(pr.data);

                let matData;
                if (user.roles.includes("DOCENTE")) {
                    const r = await api.get(`/docentes/${user.id}/materias`);
                    matData = r.data.map((x) => ({ materia: x.materia, materia_id: x.materia.id }));
                } else {
                    const r = await api.get("/materias");
                    matData = r.data.map((m) => ({ materia: m, materia_id: m.id }));
                }
                setMaterias(matData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (user) init();
    }, [user]);

    useEffect(() => {
        if (!selMat || activeTab === "materias") return;
        loadData();
    }, [selMat, activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (user.roles.includes("DOCENTE")) {
                if (activeTab === "asesorias") {
                    const r = await api.get(`/docentes/${user.id}/asesorias`);
                    setAsesorias(r.data.asesorias);
                } else if (activeTab === "horarios") {
                    const r = await api.get(`/docentes/${user.id}/asesorias`);
                    const allH = r.data.asesorias.flatMap((a) => a.HorarioAsesoria || []);
                    setHorarios(
                        allH.map((h) => ({
                            ...h,
                            docente: `${user.nombres} ${user.apellidos}`,
                        }))
                    );
                } else if (activeTab === "asistencias") {
                    const r = await api.get(`/docentes/${user.id}/asistencias-asesorias`);
                    const arr = Array.isArray(r.data)
                        ? r.data
                        : Array.isArray(r.data?.asistencias)
                            ? r.data.asistencias
                            : [];
                    setAsistencias(arr);
                }
            } else {
                if (activeTab === "asesorias") {
                    const r = await api.get("/asesorias", { params: { materia_id: selMat.materia_id } });

                    const lista = r.data.map((a) => {
                        // CORRECCIÓN: es TipoAsesorium, no TipoAsesoria
                        const tipo = a.TipoAsesorium?.nombre || "Sin tipo";
                        const periodo = a.PeriodoAcademico?.nombre || "Sin periodo";
                        const nombreDoc = a.Docente?.Usuario?.nombres || "";
                        const apellidoDoc = a.Docente?.Usuario?.apellidos || "";
                        const docente = `${nombreDoc} ${apellidoDoc}`.trim() || "Sin docente";

                        return { ...a, tipo, periodo, docente };
                    });
                    setAsesorias(lista);

                } else if (activeTab === "horarios") {
                    const r = await api.get(
                        `/estudiantes/${user.id}/materias/${selMat.materia_id}/horarios-asesorias`
                    );

                    // Obtener info de docentes desde asesorías
                    const asesoriaR = await api.get("/asesorias", { params: { materia_id: selMat.materia_id } });
                    const asesoriaMap = {};
                    asesoriaR.data.forEach(a => {
                        const nombreDoc = a.Docente?.Usuario?.nombres || "";
                        const apellidoDoc = a.Docente?.Usuario?.apellidos || "";
                        const docente = `${nombreDoc} ${apellidoDoc}`.trim() || "Sin docente";
                        asesoriaMap[a.id] = docente;
                    });

                    const raw = r.data?.horarios || [];
                    const items = raw.map((h) => {
                        return {
                            id: h.id,
                            dia_semana: h.dia_semana,
                            hora_inicio: h.hora_inicio,
                            hora_fin: h.hora_fin,
                            ubicacion: h.ubicacion,
                            docente: asesoriaMap[h.asesoria_id] || "Sin docente"
                        };
                    });
                    setHorarios(items);
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMat = (m) => {
        setSelMat(m);
        setActiveTab("asesorias");
    };

    // CRUD Asesoría
    const openAsesoriaModal = (a = null) => {
        setEditing(a);
        setForm({
            tipo_asesoria_id: a?.tipo_asesoria_id || "",
            periodo_id: a?.periodo_id || "",
        });
        setShowModal(true);
    };
    const saveAsesoria = async () => {
        try {
            if (editing) {
                await api.put(`/asesorias/${editing.id}`, form);
            } else {
                await api.post("/asesorias", {
                    ...form,
                    docente_id: user.id,
                    materia_id: selMat.materia_id,
                });
            }
            setShowModal(false);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };
    const removeAsesoria = async (id) => {
        if (!window.confirm("¿Eliminar asesoría?")) return;
        await api.delete(`/asesorias/${id}`);
        await loadData();
    };

    // CRUD Horario
    const openHorarioModal = (h = null) => {
        setHorarioEditing(h);
        setHorarioForm({
            asesoria_id: h?.asesoria_id || "",
            dia_semana: h?.dia_semana || "",
            hora_inicio: h?.hora_inicio || "",
            hora_fin: h?.hora_fin || "",
            ubicacion: h?.ubicacion || "",
        });
        setShowHorarioModal(true);
    };
    const saveHorario = async () => {
        try {
            if (horarioEditing) {
                await api.put(`/horario-asesorias/${horarioEditing.id}`, horarioForm);
            } else {
                await api.post("/horario-asesorias", {
                    ...horarioForm,
                    asesoria_id: horarioForm.asesoria_id,
                });
            }
            setShowHorarioModal(false);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };
    const removeHorario = async (id) => {
        if (!window.confirm("¿Eliminar horario?")) return;
        await api.delete(`/horario-asesorias/${id}`);
        await loadData();
    };

    // Registrar asistencia (profesor)
    const registrarAsistencia = async (horarioId) => {
        const estudianteId = window.prompt("ID del estudiante que asistió:");
        if (!estudianteId) return;
        try {
            await api.post("/asistencia-asesorias", {
                horario_asesoria_id: horarioId,
                estudiante_id: estudianteId,
                fecha_hora: new Date().toISOString(),
            });
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <Spinner animation="border" /> Cargando...
            </div>
        );
    }

    return (
        <Container fluid className="py-4 asistencias-container">
            <h2 className="text-danger mb-4">
                <BookOpen className="me-2" size={28} /> Gestión de Asesorías
            </h2>
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {/* PESTAÑAS */}
            <div className="mb-3">
                <Button
                    variant={activeTab === "materias" ? "danger" : "outline-danger"}
                    onClick={() => setActiveTab("materias")}
                    className="me-2"
                >
                    Mis Materias
                </Button>
                {selMat && (
                    <>
                        <Button
                            variant={activeTab === "asesorias" ? "danger" : "outline-danger"}
                            onClick={() => setActiveTab("asesorias")}
                            className="me-2"
                        >
                            Asesorías
                        </Button>
                        <Button
                            variant={activeTab === "horarios" ? "danger" : "outline-danger"}
                            onClick={() => setActiveTab("horarios")}
                            className="me-2"
                        >
                            Horarios
                        </Button>
                        {user.roles.includes("DOCENTE") && (
                            <Button
                                variant={
                                    activeTab === "asistencias" ? "danger" : "outline-danger"
                                }
                                onClick={() => setActiveTab("asistencias")}
                            >
                                Asistencias
                            </Button>
                        )}
                    </>
                )}
            </div>

            {/* LISTA DE MATERIAS */}
            {activeTab === "materias" && (
                <Row className="row-cols-1 row-cols-md-3 g-4">
                    {materias.map((m) => (
                        <Col key={m.materia_id}>
                            <Button
                                className="w-100 materia-card"
                                variant={
                                    selMat?.materia_id === m.materia_id ? "danger" : "light"
                                }
                                onClick={() => handleSelectMat(m)}
                            >
                                <BookOpen size={24} className="mb-2" />
                                <div>{m.materia.nombre}</div>
                                <small>{m.materia.codigo}</small>
                            </Button>
                        </Col>
                    ))}
                </Row>
            )}

            {/* PESTAÑA ASESORÍAS */}
            {activeTab === "asesorias" && selMat && (
                <>
                    {user.roles.includes("DOCENTE") && (
                        <Button
                            variant="danger"
                            className="mb-3"
                            onClick={() => openAsesoriaModal()}
                        >
                            <Plus className="me-1" /> Nueva
                        </Button>
                    )}
                    <Table hover>
                        <thead className="table-light">
                            <tr>
                                <th>Tipo</th>
                                <th>Periodo</th>
                                <th>Docente</th>
                                {user.roles.includes("DOCENTE") && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {asesorias.map((a) => (
                                <tr key={a.id}>
                                    <td>
                                        {user.roles.includes("DOCENTE")
                                            ? tipos.find((t) => t.id === a.tipo_asesoria_id)?.nombre
                                            : a.tipo}
                                    </td>
                                    <td>
                                        {user.roles.includes("DOCENTE")
                                            ? periodos.find((p) => p.id === a.periodo_id)?.nombre
                                            : a.periodo}
                                    </td>
                                    <td>
                                        {user.roles.includes("DOCENTE")
                                            ? `${user.nombres} ${user.apellidos}`
                                            : a.docente}
                                    </td>
                                    {user.roles.includes("DOCENTE") && (
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-info"
                                                onClick={() => openAsesoriaModal(a)}
                                            >
                                                <Edit size={14} />
                                            </Button>{" "}
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => removeAsesoria(a.id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            {/* PESTAÑA HORARIOS */}
            {activeTab === "horarios" && selMat && (
                <>
                    {user.roles.includes("DOCENTE") && (
                        <Button
                            variant="outline-secondary"
                            className="mb-3"
                            onClick={() => openHorarioModal()}
                        >
                            <PlusSquare className="me-1" /> Nuevo Horario
                        </Button>
                    )}
                    <Table hover>
                        <thead className="table-light">
                            <tr>
                                <th>Día</th>
                                <th>Hora</th>
                                <th>Ubicación</th>
                                <th>Profesor</th>
                                {user.roles.includes("DOCENTE") && (
                                    <>
                                        <th>Acciones</th>
                                        <th>Asistencia</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {horarios.map((h) => (
                                <tr key={h.id}>
                                    <td>{diaAbbrev[h.dia_semana]}</td>
                                    <td>
                                        {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                                    </td>
                                    <td>{h.ubicacion}</td>
                                    <td>
                                        {user.roles.includes("DOCENTE")
                                            ? `${user.nombres} ${user.apellidos}`
                                            : h.docente}
                                    </td>
                                    {user.roles.includes("DOCENTE") && (
                                        <>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-info"
                                                    onClick={() => openHorarioModal(h)}
                                                >
                                                    <Edit size={14} />
                                                </Button>{" "}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => removeHorario(h.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => registrarAsistencia(h.id)}
                                                >
                                                    <Clock size={14} />
                                                </Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            {/* PESTAÑA ASISTENCIAS */}
            {activeTab === "asistencias" && selMat && user.roles.includes("DOCENTE") && (
                <Table hover className="mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Estudiante</th>
                            <th>Fecha/Hora</th>
                            <th>Día</th>
                            <th>Hora</th>
                            <th>Ubicación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asistencias.map((a) => {
                            const h = a.HorarioAsesorium;
                            const uEst = a.Estudiante?.Usuario;
                            if (!h || !uEst) return null;
                            return (
                                <tr key={a.id}>
                                    <td>
                                        {uEst.nombres} {uEst.apellidos}
                                    </td>
                                    <td>{new Date(a.fecha_hora).toLocaleString()}</td>
                                    <td>{diaAbbrev[h.dia_semana]}</td>
                                    <td>
                                        {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                                    </td>
                                    <td>{h.ubicacion}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            {/* Modals */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? "Editar Asesoría" : "Nueva Asesoría"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                            value={form.tipo_asesoria_id}
                            onChange={(e) => setForm({ ...form, tipo_asesoria_id: e.target.value })}
                        >
                            <option value="">Seleccione...</option>
                            {tipos.map((t) => (
                                <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Periodo</Form.Label>
                        <Form.Select
                            value={form.periodo_id}
                            onChange={(e) => setForm({ ...form, periodo_id: e.target.value })}
                        >
                            <option value="">Seleccione...</option>
                            {periodos.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={saveAsesoria}>Guardar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showHorarioModal} onHide={() => setShowHorarioModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{horarioEditing ? "Editar Horario" : "Nuevo Horario"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Asesoría</Form.Label>
                        <Form.Select
                            value={horarioForm.asesoria_id}
                            onChange={(e) => setHorarioForm({ ...horarioForm, asesoria_id: e.target.value })}
                        >
                            <option value="">Seleccione...</option>
                            {asesorias.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {tipos.find((t) => t.id === a.tipo_asesoria_id)?.nombre} -{" "}
                                    {periodos.find((p) => p.id === a.periodo_id)?.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Día</Form.Label>
                        <Form.Select
                            value={horarioForm.dia_semana}
                            onChange={(e) => setHorarioForm({ ...horarioForm, dia_semana: e.target.value })}
                        >
                            <option value="">Seleccione...</option>
                            {diaOptions.map((d) => (
                                <option key={d} value={d}>{diaAbbrev[d]}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hora Inicio</Form.Label>
                        <Form.Control
                            type="time"
                            value={horarioForm.hora_inicio}
                            onChange={(e) => setHorarioForm({ ...horarioForm, hora_inicio: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hora Fin</Form.Label>
                        <Form.Control
                            type="time"
                            value={horarioForm.hora_fin}
                            onChange={(e) => setHorarioForm({ ...horarioForm, hora_fin: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ubicación</Form.Label>
                        <Form.Control
                            type="text"
                            value={horarioForm.ubicacion}
                            onChange={(e) => setHorarioForm({ ...horarioForm, ubicacion: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHorarioModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={saveHorario}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AsesoriasPage;
