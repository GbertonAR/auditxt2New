import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Bar, Line, Pie } from 'react-chartjs-2'
import 'chart.js/auto'

export default function Dashboard() {
  const [totales, setTotales] = useState(null)
  const [evolucion, setEvolucion] = useState([])
  const [preguntas, setPreguntas] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [modelos, setModelos] = useState([])

  useEffect(() => {
    fetch('/api/dashboard/totales').then(res => res.json()).then(setTotales)
    fetch('/api/dashboard/evolucion').then(res => res.json()).then(setEvolucion)
    fetch('/api/dashboard/preguntas-recientes').then(res => res.json()).then(setPreguntas)
    fetch('/api/dashboard/feedback').then(res => res.json()).then(setFeedback)
    fetch('/api/dashboard/por-usuario').then(res => res.json()).then(setUsuarios)
    fetch('/api/dashboard/por-modelo').then(res => res.json()).then(setModelos)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Dashboard ANSV Bot</h1>

      {totales && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent><p className="text-sm text-gray-500">Consultas hoy</p><p className="text-xl font-bold">{totales.total_hoy}</p></CardContent></Card>
          <Card><CardContent><p className="text-sm text-gray-500">Consultas mes</p><p className="text-xl font-bold">{totales.total_mes}</p></CardContent></Card>
          <Card><CardContent><p className="text-sm text-gray-500">Usuarios únicos</p><p className="text-xl font-bold">{totales.usuarios_unicos}</p></CardContent></Card>
          <Card><CardContent><p className="text-sm text-gray-500">⏱ Prom. Respuesta</p><p className="text-xl font-bold">{totales.promedio_respuesta_ms} ms</p></CardContent></Card>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">📈 Evolución últimos 30 días</h2>
        <Line data={{
          labels: evolucion.map(d => d.fecha),
          datasets: [{
            label: 'Consultas',
            data: evolucion.map(d => d.consultas),
            backgroundColor: '#60A5FA',
            borderColor: '#3B82F6',
            fill: true
          }]
        }} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">🧠 Top 5 Usuarios Activos</h2>
            <ul className="space-y-1">
              {usuarios.map(u => (
                <li key={u.id_usuario} className="text-sm">{u.id_usuario} — <span className="font-bold">{u.cantidad}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">🤖 Modelos más usados</h2>
            <ul className="space-y-1">
              {modelos.map(m => (
                <li key={m.modelo_ia_usado} className="text-sm">{m.modelo_ia_usado} — <span className="font-bold">{m.cantidad}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">🗣 Últimas 15 preguntas</h2>
        <div className="overflow-auto max-h-80">
          <table className="table-auto w-full text-sm">
            <thead><tr className="bg-gray-100"><th className="px-2 py-1">Usuario</th><th>Consulta</th><th>Respuesta</th><th>Tiempo</th></tr></thead>
            <tbody>
              {preguntas.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1 text-gray-500">{p.id_usuario}</td>
                  <td>{p.texto_consulta.slice(0, 80)}</td>
                  <td>{p.texto_respuesta?.slice(0, 80) ?? '—'}</td>
                  <td className="text-center">{p.tiempo_respuesta_ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {feedback && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">👍 Feedback</h2>
          <Pie data={{
            labels: ['Positivos', 'Negativos', 'Sin marcar'],
            datasets: [{
              data: [feedback.positivos, feedback.negativos, feedback.sin_marcar],
              backgroundColor: ['#10B981', '#EF4444', '#D1D5DB']
            }]
          }} />
        </div>
      )}
    </div>
  )
}
