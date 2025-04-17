
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Volume2, Radio } from "lucide-react";

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="introduction">Introduction</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="streaming">Streaming</TabsTrigger>
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
            </div>
          </TabsContent>
          
          <TabsContent value="streaming" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Audio Streaming</h3>
              <p>
                The ElevenLabs API supports real-time audio streaming for select endpoints, returning raw audio 
                bytes (e.g., MP3 data) directly over HTTP using chunked transfer encoding. This allows clients 
                to process or play audio incrementally as it is generated.
              </p>
              
              <div className="flex items-center gap-2 mt-3 text-blue-600">
                <Volume2 size={20} />
                <h4 className="font-medium">Streaming Support</h4>
              </div>
              <p>Streaming is supported for:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Text to Speech API</li>
                <li>Voice Changer API</li>
                <li>Audio Isolation API</li>
              </ul>
              
              <h4 className="font-medium mt-4">Python Example:</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                <p>from elevenlabs import stream</p>
                <p>from elevenlabs.client import ElevenLabs</p>
                <p>client = ElevenLabs()</p>
                <p>audio_stream = client.text_to_speech.convert_as_stream(</p>
                <p>&nbsp;&nbsp;text="This is a test",</p>
                <p>&nbsp;&nbsp;voice_id="JBFqnCBsd6RMkjVDRZzb",</p>
                <p>&nbsp;&nbsp;model_id="eleven_multilingual_v2"</p>
                <p>)</p>
                <p># option 1: play the streamed audio locally</p>
                <p>stream(audio_stream)</p>
                <p># option 2: process the audio bytes manually</p>
                <p>for chunk in audio_stream:</p>
                <p>&nbsp;&nbsp;if isinstance(chunk, bytes):</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;print(chunk)</p>
              </div>
              
              <h4 className="font-medium mt-4">Node.js / TypeScript Example:</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                <p>import {"{ ElevenLabsClient, stream }"} from 'elevenlabs';</p>
                <p>import {"{ Readable }"} from 'stream';</p>
                <p>const client = new ElevenLabsClient();</p>
                <p>async function main() {"{"}</p>
                <p>&nbsp;&nbsp;const audioStream = await client.textToSpeech.convertAsStream('JBFqnCBsd6RMkjVDRZzb', {"{"}</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;text: 'This is a test',</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;model_id: 'eleven_multilingual_v2',</p>
                <p>&nbsp;&nbsp;{"}"});</p>
                <p>&nbsp;&nbsp;// option 1: play the streamed audio locally</p>
                <p>&nbsp;&nbsp;await stream(Readable.from(audioStream));</p>
                <p>&nbsp;&nbsp;// option 2: process the audio manually</p>
                <p>&nbsp;&nbsp;for await (const chunk of audioStream) {"{"}</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;console.log(chunk);</p>
                <p>&nbsp;&nbsp;{"}"}</p>
                <p>{"}"}</p>
                <p>main();</p>
              </div>
              
              <div className="flex items-center gap-2 mt-4 text-green-600">
                <Radio size={20} />
                <h4 className="font-medium">Available Voice IDs</h4>
              </div>
              <p>Popular ElevenLabs voice IDs you can use:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>George:</strong> JBFqnCBsd6RMkjVDRZzb</li>
                <li><strong>Rachel:</strong> 21m00Tcm4TlvDq8ikWAM</li>
                <li><strong>Aria:</strong> 9BWtsMINqrJLrRacOk9x</li>
                <li><strong>Daniel:</strong> onwK4e9ZLuTAKqWW03F9</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsApiInfo;
