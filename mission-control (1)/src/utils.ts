import { Task } from './types';

export const getAvatarColor = (name: string) => {
  if (!name) return 'bg-gray-500';
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-red-500', 'bg-teal-500', 'bg-orange-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const formatLocalTime = (timeString?: string) => {
  if (!timeString) return '00:00';
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    // Assume input is ET (UTC-4)
    date.setUTCHours(hours + 4, minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeString;
  }
};

export const isTaskActive = (task: Task) => {
  return ['in-progress', 'review'].includes(task.status) && !task.isStuck;
};
