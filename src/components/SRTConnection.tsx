import { InputProcess } from "@/types/processTypes";
import CopyButton from "./CopyButton";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SRTConnectionProps {
  input: InputProcess;
}

export default function SRTConnection({ input }: SRTConnectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_RESTREAMER_BASE_URL || "";
  const port = process.env.NEXT_PUBLIC_RESTREAMER_PORT || "6000";
  const streamId = input.streamName;

  const url = `srt://${baseUrl}`;
  const oneLine = `${url}:${port}?mode=caller&streamid=${streamId},mode:publish`;

  return (
    <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Información de conexión SRT
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {isCollapsed ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-2 text-xs">
          <div className="flex items-start justify-between p-1 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="min-w-0 flex-1 mr-2">
              <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">
                URL
              </span>
              <p className="text-gray-900 dark:text-white break-all">{url}</p>
            </div>
            <div className="flex-shrink-0">
              <CopyButton text={url} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1 mr-2">
                <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Port
                </span>
                <p className="text-gray-900 dark:text-white break-all">{port}</p>
              </div>
              <div className="flex-shrink-0">
                <CopyButton text={port} />
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Mode
              </span>
              <p className="text-gray-900 dark:text-white">Caller</p>
            </div>
          </div>

          <div className="flex items-start justify-between p-1 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="min-w-0 flex-1 mr-2">
              <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Stream ID
              </span>
              <p className="text-gray-900 dark:text-white break-all">{streamId}</p>
            </div>
            <div className="flex-shrink-0">
              <CopyButton text={streamId} />
            </div>
          </div>

          <div className="flex items-start justify-between p-1 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="min-w-0 flex-1 mr-2">
              <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">
                One-Line
              </span>
              <p className="text-gray-900 dark:text-white break-all">{oneLine}</p>
            </div>
            <div className="flex-shrink-0">
              <CopyButton text={oneLine} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
