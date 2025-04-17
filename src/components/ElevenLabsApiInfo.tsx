
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";

const ElevenLabsApiInfo: React.FC = () => {
  return (
    <Card className="mb-6 mx-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Code size={20} className="text-blue-500" />
          <CardTitle>ElevenLabs API</CardTitle>
        </div>
        <CardDescription>
          High-quality Text-to-Speech API for creating realistic voices and audio content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="introduction" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="introduction">Introduction</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
          </TabsList>
          
          <TabsContent value="introduction" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Installation</h3>
              <p>
                You can interact with the API through HTTP or Websocket requests from any language, 
                via the official Python bindings or Node.js libraries.
              </p>
              
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <p className="mb-2"># Install the official Python bindings</p>
                <code>pip install elevenlabs</code>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <p className="mb-2">// Install the official Node.js library</p>
                <code>npm install elevenlabs</code>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="authentication" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">API Keys</h3>
              <p>
                The ElevenLabs API uses API keys for authentication. Every request to the API 
                must include your API key, used to authenticate your requests and track usage quota.
              </p>
              
              <h4 className="font-medium mt-4">API Key Scopes:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="font-medium">Scope restriction:</span> Set access restrictions by limiting which API endpoints the key can access.</li>
                <li><span className="font-medium">Credit quota:</span> Define custom credit limits to control usage.</li>
              </ul>
              
              <div className="bg-yellow-100 p-3 rounded-md text-yellow-800 mt-4">
                <p>
                  <strong>Important:</strong> Your API key is a secret. Do not share it with others 
                  or expose it in any client-side code (browsers, apps).
                </p>
              </div>
              
              <h4 className="font-medium mt-4">Including Your API Key:</h4>
              <p>All API requests should include your API key in an <code className="px-1 py-0.5 bg-gray-200 rounded">xi-api-key</code> HTTP header:</p>
              
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <code>xi-api-key: ELEVENLABS_API_KEY</code>
              </div>
              
              <h4 className="font-medium mt-4">Example Request:</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <p>curl 'https://api.elevenlabs.io/v1/models' \</p>
                <p>&nbsp;&nbsp;-H 'Content-Type: application/json' \</p>
                <p>&nbsp;&nbsp;-H 'xi-api-key: $ELEVENLABS_API_KEY'</p>
              </div>
              
              <h4 className="font-medium mt-4">With Python:</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <p>from elevenlabs.client import ElevenLabs</p>
                <p>client = ElevenLabs(</p>
                <p>&nbsp;&nbsp;api_key='YOUR_API_KEY',</p>
                <p>)</p>
              </div>
              
              <h4 className="font-medium mt-4">With Node.js:</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <p>import {"{ ElevenLabsClient }"} from 'elevenlabs';</p>
                <p>const client = new ElevenLabsClient({"{"}</p>
                <p>&nbsp;&nbsp;apiKey: 'YOUR_API_KEY',</p>
                <p>{"}"});</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsApiInfo;
