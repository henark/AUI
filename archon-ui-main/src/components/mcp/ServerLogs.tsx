import React, { useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LogEntry } from '../../services/mcpServerService';

interface ServerLogsProps {
  logs: (LogEntry | string)[];
  serverStatus: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  handleClearLogs: () => void;
}

export const ServerLogs: React.FC<ServerLogsProps> = ({
  logs,
  serverStatus,
  handleClearLogs,
}) => {
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current && logsEndRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const formatLogEntry = (log: LogEntry | string): string => {
    if (typeof log === 'string') {
      return log;
    }
    return `[${log.level}] ${log.message}`;
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Clock className="mr-2 text-purple-500" size={20} />
        Server Logs
      </h2>
      <Card accentColor="purple" className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            {logs.length > 0
              ? `Showing ${logs.length} log entries`
              : 'No logs available'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearLogs}
            disabled={logs.length === 0}
          >
            Clear Logs
          </Button>
        </div>
        <div
          id="mcp-logs-container"
          ref={logsContainerRef}
          className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-900 rounded-md p-4 flex-1 overflow-y-auto font-mono text-sm max-h-[600px]"
        >
          {logs.length === 0 ? (
            <p className="text-gray-500 dark:text-zinc-500 text-center py-8">
              {serverStatus === 'running'
                ? 'Waiting for log entries...'
                : 'Start the server to see logs'}
            </p>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`py-1.5 border-b border-gray-100 dark:border-zinc-900 last:border-0 ${
                  typeof log !== 'string' && log.level === 'ERROR'
                    ? 'text-red-600 dark:text-red-400'
                    : typeof log !== 'string' && log.level === 'WARNING'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-600 dark:text-zinc-400'
                }`}
              >
                {formatLogEntry(log)}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </Card>
    </div>
  );
};
