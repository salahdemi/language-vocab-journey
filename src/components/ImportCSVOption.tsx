
import React, { useState, useRef } from "react";
import { useVocab } from "@/context/VocabContext";
import { ArrowLeft, FileText, Upload, Check } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";

interface ImportCSVOptionProps {
  deckId: string;
  onBack: () => void;
}

const ImportCSVOption: React.FC<ImportCSVOptionProps> = ({ deckId, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [imported, setImported] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importCardsFromCSV } = useVocab();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read and preview the CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').slice(0, 5); // Preview first 5 lines
        const parsedPreview = lines.map(line => line.split(',').map(cell => cell.trim()));
        setPreview(parsedPreview);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const count = importCardsFromCSV(deckId, text);
        // Fix here: Store the result of importCardsFromCSV in a variable first
        if (typeof count === 'number') {
          setImportCount(count);
        } else {
          // If the function doesn't return a number, set a default
          setImportCount(0);
          console.error("importCardsFromCSV did not return a number");
        }
        setImported(true);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center">
        <button onClick={onBack} className="mr-3">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-medium">CSV Import</h2>
      </div>
      
      <div className="p-4 flex-grow">
        {imported ? (
          <div className="text-center py-10">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Import completed!</h3>
            <p className="text-gray-500">Successfully imported {importCount} cards to your deck.</p>
          </div>
        ) : (
          <>
            <p className="mb-6">Import your flashcards from a CSV file. The file should have two columns: the first column for the front side and the second column for the back side of the card.</p>
            
            {file ? (
              <div className="mb-6">
                <div className="bg-gray-100 p-4 rounded-lg mb-3 flex items-center">
                  <FileText className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                
                {preview.length > 0 && (
                  <div className="border rounded-lg mb-4 overflow-hidden">
                    <div className="p-3 border-b bg-gray-50">
                      <h3 className="font-medium">Preview</h3>
                    </div>
                    <div className="p-3">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left pb-2 pr-2">Front</th>
                            <th className="text-left pb-2">Back</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((row, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2 pr-2">{row[0]}</td>
                              <td className="py-2">{row[1]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setFile(null);
                      setPreview([]);
                    }}
                    className="flex-1 py-3 border border-gray-300 rounded-lg"
                  >
                    Change file
                  </button>
                  <button 
                    onClick={handleImport}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg"
                  >
                    Import
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer hover:bg-gray-50"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="text-blue-500" size={28} />
                  </div>
                  <h3 className="font-medium mb-2">Upload CSV file</h3>
                  <p className="text-gray-500 text-sm mb-4">Click to browse or drag and drop</p>
                  <p className="text-gray-400 text-xs">.csv files only</p>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-gray-50">
                    <h3 className="font-medium">Sample CSV format</h3>
                  </div>
                  <div className="p-3">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left pb-2 pr-2">Front</th>
                          <th className="text-left pb-2">Back</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 pr-2">hello</td>
                          <td className="py-2">hola</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 pr-2">goodbye</td>
                          <td className="py-2">adiós</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2">thank you</td>
                          <td className="py-2">gracias</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {imported && (
        <div className="p-4 border-t">
          <DialogClose asChild>
            <button className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium">
              Done
            </button>
          </DialogClose>
        </div>
      )}
    </div>
  );
};

export default ImportCSVOption;
