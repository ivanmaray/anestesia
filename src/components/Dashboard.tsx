import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false }, title: { display: false } },
  scales: { x: { type: 'category' as const }, y: { beginAtZero: true } },
}

const lineOptions = {
  responsive: true,
  plugins: { legend: { display: false }, title: { display: false } },
  scales: { y: { beginAtZero: true } },
}

const Dashboard: React.FC = () => {
  const alertData = {
    labels: ['Críticas', 'Advertencias', 'Información'],
    datasets: [
      {
        label: 'Número de Alertas',
        data: [12, 19, 7],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
      },
    ],
  };

  const kpiData = {
    labels: ['Antes', 'Después'],
    datasets: [
      {
        label: 'Tasa de Aceptación de Recomendaciones',
        data: [65, 85],
        borderColor: '#4BC0C0',
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Dashboard de Priorización</h2>
      <div className="chart-container glow-border p-4">
        <h3>Alertas por Severidad</h3>
        <Bar id="alert-bar" key="alert-bar" data={alertData} options={barOptions} />
      </div>
      <div className="chart-container glow-border p-4">
        <h3>Evolución de la Tasa de Aceptación</h3>
        <Line id="kpi-line" key="kpi-line" data={kpiData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Dashboard;