import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface Task {
  id: number;
  text: string;
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: task }]);
    setTask('');
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <div className="flex space-x-2">
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <Card key={t.id} className="flex justify-between p-2">
            <CardContent className="flex-grow p-0">{t.text}</CardContent>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTask(t.id)}
            >
              <Trash2 size={16} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
