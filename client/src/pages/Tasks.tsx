import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { fetchEndpoint } from '@/utils/fetch';

import { TaskCard } from '@/components/Task/TaskCard';

type Task = {
  "category": string;
  "completed": boolean;
  "completed_at": number;
  "created_at": number;
  "deadline": number;
  "desc": string;
  "emoji": string;
  "failed": false;
  "friend_id": string;
  "habit_frequency": number;
  "id": number;
  "incentive_max": number,
  "incentive_min": number,
  "name": string,
  "owner_id": number,
  "pinned": boolean
}

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentMisses, setRecentMisses] = useState<Task[]>([]);

  useEffect(() => {
    fetchEndpoint('overdue-reminders?id=0', 'GET').then((data) => {

      console.log(data);
      if (data.overdue_reminders.length > 0) {
        setRecentMisses(data.overdue_reminders);
        toast.error(
          <div>
            You missed <b>{data.overdue_reminders.length}</b> tasks,
            losing {data.charge.toFixed(2) * .001} ETH in total. 😢
          </div>
        );
      }

      fetchEndpoint('reminders?id=0', 'GET').then((data) => {
        setTasks(data.sort((a: Task, b: Task) => {
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

    }).catch((err) => console.error(err));
  }, []);

  const formatDate = (d: number, inFuture = true) => {
    const roundDay = (n: number) => Math.floor((new Date(n).getTime()) / 86400000);

    if (inFuture && (roundDay(d * 1000) - roundDay(Date.now()) === 0)) {
      return 'today ' + (new Date(d * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }));
    } else if (inFuture && (roundDay(d * 1000) - roundDay(Date.now()) === 1)) {
      return 'tomorrow ' + (new Date(d * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }));
    }

    let f = new Date(d * 1000).toLocaleDateString('en-US', {
      weekday: ((roundDay(d * 1000) - roundDay(Date.now())) * (inFuture ? 1 : -1) > 7) ? 'short' : 'long',
      year: (new Date(d * 1000).getFullYear() === new Date().getFullYear()) ? undefined : 'numeric',
      month: ((roundDay(d * 1000) - roundDay(Date.now())) * (inFuture ? 1 : -1) > 7) ? 'long' : undefined,
      day: ((roundDay(d * 1000) - roundDay(Date.now())) * (inFuture ? 1 : -1) > 7) ? 'numeric' : undefined,
      hour: inFuture ? 'numeric' : undefined,
      minute: inFuture ? 'numeric' : undefined,
    });
    if (!inFuture && (roundDay(d * 1000) - roundDay(Date.now())) * (-1) <= 7) {
      if (roundDay(d * 1000) - roundDay(Date.now()) === 0) {
        return 'today';
      }
      if (roundDay(d * 1000) - roundDay(Date.now()) === -1) {
        return 'yesterday';
      }
      f = 'last ' + f;
    }
    return f;
  }

  const formatInterval = (d: number) => {
    return d === 1 ? 'daily' :
      d == 7 ? 'weekly' :
        'once every ' + d + ' days';
  }

  return (
    <>
      <h1>Tasks</h1>

      {recentMisses.length > 0 ?
        <>
          <h2>Just Missed 😢</h2>
          <ul>
            {recentMisses.map((task) => (
              <li key={task.id}>
                {task.emoji} {task.name}
              </li>
            ))}
          </ul>
        </>
        : <></>
      }

      <h2>To-Do</h2>
      <ul>
        {tasks.map((task) => (
          task.completed || !task.pinned || Date.now() > task.deadline * 1000 ? <></>
            :
            <TaskCard task={task} />
          // <li key={task.id}>
          //   📌{task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Do by {formatDate(task.deadline)}
          //   {task.habit_frequency > 0 ? <><br />Habit: {formatInterval(task.habit_frequency)}</> : <></>}
          // </li>
        ))}
      </ul>

      <ul>
        {tasks.map((task) => (
          task.completed || task.pinned || Date.now() > task.deadline * 1000 ? <></>
            :
            <TaskCard task={task} />
          // <li key={task.id}>
          //   {task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Do by {formatDate(task.deadline)}
          //   {task.habit_frequency > 0 ? <><br />Habit: {formatInterval(task.habit_frequency)}</> : <></>}
          // </li>
        ))}
      </ul>

      <h2>Completed</h2>
      <ul>
        {tasks.map((task) => (
          task.completed &&
          <TaskCard task={task} />
          // <li key={task.id}>
          //   {task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Finished {formatDate(task.completed_at, false)}
          // </li>
          // :
          // <></>
        ))
        }
      </ul>

      <h2>Missed</h2>
      <ul>
        {tasks.map((task) => (
          task.completed || Date.now() < task.deadline * 1000 ? <></>
            :
            <TaskCard task={{ ...task, failed: true }} />

          // <li key={task.id}>
          //   {task.emoji} {task.name}
          //   {task.desc ? <><br />{task.desc}</> : <></>}
          //   <br />Supposed to do by {formatDate(task.deadline, false)}
          // </li>
        ))}
      </ul>
    </>
  );
};
