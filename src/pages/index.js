import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  const [tasks, setTasks] = useState([]);

  const [completedTasks, setCompletedTasks] = useState([]);

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const router = useRouter();

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompleted = localStorage.getItem('completedTasks');
    console.log(savedTasks, savedCompleted);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted));
  }, []);

  const isInitialTasks = useRef(true);
  useEffect(() => {
    if (isInitialTasks.current) {
      isInitialTasks.current = false;
      return;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const isInitialCompleted = useRef(true);
  useEffect(() => {
    if (isInitialCompleted.current) {
      isInitialCompleted.current = false;
      return;
    }
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), priority }]);
      setNewTask('');
      setPriority('Low');
    }
  };

  const completeTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setCompletedTasks([...completedTasks, task]);
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const priorityStyles = {
    High: 'bg-red-500 text-white',
    Medium: 'bg-yellow-500 text-white',
    Low: 'bg-green-500 text-white',
  };

  const priorityWeight = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const sortedTasks = [...tasks].sort(
    (a, b) =>
      priorityWeight[a.priority ?? 'Low'] - priorityWeight[b.priority ?? 'Low'],
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Todo List</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a new task..."
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm focus:outline-none"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <Button onClick={addTask}>Add</Button>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Incomplete Tasks</h2>
              <Badge variant="secondary">{tasks.length}</Badge>
            </div>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No tasks yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {sortedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <span>{task.text}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityStyles[task.priority ?? 'Low']}>
                        {task.priority ?? 'Low'}
                      </Badge>
                      <Button
                        onClick={() => completeTask(task.id)}
                        size="sm"
                        variant="default"
                      >
                        Complete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Separator />

          <div className="text-center">
            <Button
              onClick={() => router.push('/completed')}
              variant="outline"
              className="flex items-center gap-2"
            >
              View Completed Tasks
              <Badge variant="secondary">{completedTasks.length}</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
