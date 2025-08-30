import React from 'react';
import { Play, Square, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ServerStatus } from '../../services/mcpServerService';

interface ServerControlProps {
  serverStatus: ServerStatus;
  isStarting: boolean;
  isStopping: boolean;
  handleStartServer: () => void;
  handleStopServer: () => void;
  formatUptime: (uptime: number) => string;
}

export const ServerControl: React.FC<ServerControlProps> = ({
  serverStatus,
  isStarting,
  isStopping,
  handleStartServer,
  handleStopServer,
  formatUptime,
}) => {
  const getStatusIcon = () => {
    switch (serverStatus.status) {
      case 'running':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'starting':
      case 'stopping':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (serverStatus.status) {
      case 'running':
        return 'text-green-500';
      case 'starting':
      case 'stopping':
        return 'text-blue-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <Card accentColor="blue" className="space-y-6 flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className={`font-semibold ${getStatusColor()}`}>
              Status: {serverStatus.status.charAt(0).toUpperCase() + serverStatus.status.slice(1)}
            </p>
            {serverStatus.uptime !== null && (
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Uptime: {formatUptime(serverStatus.uptime)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {serverStatus.status === 'stopped' ? (
            <Button
              onClick={handleStartServer}
              disabled={isStarting}
              variant="primary"
              accentColor="green"
              className="shadow-emerald-500/20 shadow-sm"
            >
              {isStarting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 inline" />
                  Start Server
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleStopServer}
              disabled={isStopping || serverStatus.status !== 'running'}
              variant="primary"
              accentColor="pink"
              className="shadow-pink-500/20 shadow-sm"
            >
              {isStopping ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 mr-2 inline" />
                  Stop Server
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
