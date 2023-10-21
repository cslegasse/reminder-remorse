import { useState, useEffect } from "react";
import { fetchEndpoint } from "@/utils/fetch";
import { Chart, ChartConfiguration } from 'chart.js/auto';

Chart.defaults.color = '#fff';
Chart.defaults.borderColor = '#fff';

type Metric = {
  tasksCompleted: number;
  habitsKept: number;
  completion: number[];
}

export const Insights = () => {
  const user_id = 0;

  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [chart, setChart] = useState<Chart|null>(null);
  useEffect(() => {
    fetchEndpoint(`/api/metrics?id=${user_id}`, 'GET').then((data) => {
      console.log(data);
      setMetrics(data);
    });
  }, []);

  useEffect(() => {
    console.log(metrics);
    if (metrics)
      drawTasksCompletedGraph();
  }, [metrics]);

  const drawTasksCompletedGraph = () => {
    if (!metrics)
      return;
    if (chart) {
      chart.destroy();
    }
    console.log(metrics.completion);
    console.log("Here we go!");
    let min_month = Infinity;
    let max_month = 0;
    for (let i = 0; i < metrics.completion.length; i++) {
      const d = new Date(metrics.completion[i]*1000);
      console.log(d);
      const month = d.getFullYear()*12 + d.getMonth();
      console.log(month);
      if (month < min_month) {
        min_month = month;
      }
      if (month > max_month) {
        max_month = month;
      }
    }
    if (min_month == Infinity || max_month == 0) {
      const d = new Date();
      min_month = d.getFullYear()*12 + d.getMonth();
      max_month = d.getFullYear()*12 + d.getMonth();
    }

    const labels = [];
    const per_month = [];
    for (let i = min_month; i <= max_month; i++) {
      const year = Math.floor(i/12);
      const month = i % 12;
      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      labels.push(`${MONTHS[month]} ${year}`);
      per_month.push(0);
    }
    console.log(per_month);
    console.log(metrics.completion.length);

    for (let i = 0; i < metrics.completion.length; i++) {
      const d = new Date(metrics.completion[i]*1000);
      const month = d.getFullYear()*12 + d.getMonth();
      console.log(month - min_month);
      per_month[month-min_month] += 1;
    }
    console.log(per_month);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Tasks Completed',
          data: per_month,
          fill: false,
          backgroundColor: 'rgb(156, 60, 231)',
          tension: 0.1,
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        layout: {
          padding: {
            top: 5
          }
        },
        scales: {
          y: {
            min: 0,
            max: Math.max(...per_month)+2
          }
        }
      }
    };

    const ctx = document.getElementById('tasksCompletedGraph') as HTMLCanvasElement;
    const c = new Chart(ctx, config);
    setChart(c);
  }


  return (
    <>
      <h1>Insights</h1>

      <div>
        <h2>Tasks Completed</h2>
        <p>{metrics?.tasksCompleted || ''}</p>
        <canvas id="tasksCompletedGraph" width="500" height="200"></canvas>
      </div>
      <div>
        <h2>Habits Kept</h2>
        <p>{metrics?.habitsKept || ''}</p>
      </div>
    </>
  );
};
