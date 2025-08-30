import React from 'react';
import { Copy, Server } from 'lucide-react';
import { Button } from '../ui/Button';
import { ServerConfig } from '../../services/mcpServerService';

type SupportedIDE = 'windsurf' | 'cursor' | 'claudecode' | 'cline' | 'kiro' | 'augment' | 'gemini';

interface IdeConfigurationProps {
  config: ServerConfig;
  selectedIDE: SupportedIDE;
  setSelectedIDE: (ide: SupportedIDE) => void;
  handleCopyConfig: () => void;
  handleCursorOneClick: () => void;
  getConfigForIDE: (ide: SupportedIDE) => string;
  getIDEInstructions: (ide: SupportedIDE) => { title: string; steps: string[] };
}

export const IdeConfiguration: React.FC<IdeConfigurationProps> = ({
  config,
  selectedIDE,
  setSelectedIDE,
  handleCopyConfig,
  handleCursorOneClick,
  getConfigForIDE,
  getIDEInstructions,
}) => {
  const ides: SupportedIDE[] = ['claudecode', 'gemini', 'cursor', 'windsurf', 'cline', 'kiro', 'augment'];

  return (
    <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">
          IDE Configuration
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            HTTP Mode
          </span>
        </h3>
        <Button
          variant="secondary"
          accentColor="blue"
          size="sm"
          onClick={handleCopyConfig}
        >
          <Copy className="w-3 h-3 mr-1 inline" />
          Copy
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-zinc-700 mb-3">
          {ides.map((ide) => (
            <button
              key={ide}
              onClick={() => setSelectedIDE(ide)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedIDE === ide
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
              } cursor-pointer`}
            >
              {ide.charAt(0).toUpperCase() + ide.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
          {getIDEInstructions(selectedIDE).title}
        </h4>
        <ul className="text-sm text-gray-600 dark:text-zinc-400 space-y-1">
          {getIDEInstructions(selectedIDE).steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-black/50 rounded-lg p-4 font-mono text-sm relative">
        <pre className="text-gray-600 dark:text-zinc-400 whitespace-pre-wrap">
          {getConfigForIDE(selectedIDE)}
        </pre>
        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-3 font-sans">
          {/* This part can be simplified or moved to the getIDEInstructions function */}
          Copy this configuration and add it to your IDE's settings.
        </p>
      </div>

      {selectedIDE === 'cursor' && (
        <div className="mt-4">
          <Button
            variant="primary"
            accentColor="blue"
            onClick={handleCursorOneClick}
            className="w-full"
          >
            <Server className="w-4 h-4 mr-2 inline" />
            One-Click Install for Cursor
          </Button>
          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2 text-center">
            Requires Cursor to be installed and will open a deeplink.
          </p>
        </div>
      )}
    </div>
  );
};
