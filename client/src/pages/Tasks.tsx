import { useState, useEffect } from 'react';
import { fetchEndpoint } from '@/utils/fetch';

type Task = {
  name: string;
  desc: string;
  emoji: string;
  completed: boolean;
  pinned: boolean;
  deadline: number;
  completed_at: number;
}

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    fetchEndpoint('reminders?id=0', 'GET').then((data) => {
      setTasks(data.sort((a:Task,b:Task) => {
        if (a.deadline > b.deadline) {
          return -1;
        } else if (a.deadline < b.deadline) {
          return 1;
        } else {
          return 0;
        }
      }));
      console.log(data);
    });
  }, []);

  const formatDate = (d: number, inFuture=true) => {
    const roundDay = (n: number) => Math.floor((new Date(n).getTime())/86400000);

    if (inFuture && (roundDay(d*1000) - roundDay(Date.now()) === 0)) {
      return 'today ' + (new Date(d*1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }));
    } else if (inFuture && (roundDay(d*1000) - roundDay(Date.now()) === 1)) {
      return 'tomorrow ' + (new Date(d*1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }));
    }

    let f = new Date(d*1000).toLocaleDateString('en-US', {
              weekday: ((roundDay(d*1000) - roundDay(Date.now()))*(inFuture ? 1 : -1) > 7) ? 'short' : 'long',
              year: (new Date(d*1000).getFullYear() === new Date().getFullYear()) ? undefined : 'numeric',
              month: ((roundDay(d*1000) - roundDay(Date.now()))*(inFuture ? 1 : -1) > 7) ? 'long' : undefined,
              day: ((roundDay(d*1000) - roundDay(Date.now()))*(inFuture ? 1 : -1) > 7) ? 'numeric' : undefined,
              hour: inFuture ? 'numeric' : undefined,
              minute: inFuture ? 'numeric' : undefined,
            });
    if (!inFuture && (roundDay(d*1000) - roundDay(Date.now()))*(-1) <= 7) {
      if (roundDay(d*1000) - roundDay(Date.now()) === 0) {
        return 'today';
      }
      if (roundDay(d*1000) - roundDay(Date.now()) === -1) {
        return 'yesterday';
      }
      f = 'last '+f;
    }
    return f;
  }

  return (
    <>
      <h1>Tasks</h1>

      <h2>To-Do</h2>
      <ul>
        {tasks.map((task) => (
          task.completed || !task.pinned || Date.now() > task.deadline*1000 ? <></>
          :
          <li>
            📌{task.emoji} {task.name}
            {task.desc ? <><br/>{task.desc}</> : <></>}
            <br/>Do by {formatDate(task.deadline)}
          </li>
        ))}
      </ul>

      <ul>
        {tasks.map((task) => (
          task.completed || task.pinned || Date.now() > task.deadline*1000 ? <></>
          :
          <li>
            {task.emoji} {task.name}
            {task.desc ? <><br/>{task.desc}</> : <></>}
            <br/>Do by {formatDate(task.deadline)}
          </li>
        ))}
      </ul>

      <h2>Completed</h2>
      <ul>
        {tasks.map((task) => (
          task.completed ? 
          <li>
            {task.emoji} {task.name}
            {task.desc ? <><br/>{task.desc}</> : <></>}
            <br/>Finished {formatDate(task.completed_at, false)}
          </li>
          :
          <></>
        ))}
      </ul>

      <h2>Missed</h2>
      <ul>
        {tasks.map((task) => (
          task.completed || Date.now() < task.deadline*1000 ? <></>
          :
          <li>
            {task.emoji} {task.name}
            {task.desc ? <><br/>{task.desc}</> : <></>}
            <br/>Supposed to do by {formatDate(task.deadline, false)}
          </li>
        ))}
      </ul>
    </>
  );
};