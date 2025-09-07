import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadResult {
  ipfsHash: string;
  gatewayUrl: string;
  name: string;
  size: number;
  type: string;
}

const IPFSUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', fileName || selectedFile.name);

      const { data, error } = await supabase.functions.invoke('upload-to-ipfs', {
        body: formData,
      });

      if (error) throw error;

      if (data.success) {
        setUploadResult(data);
        toast.success('File uploaded to IPFS successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Upload to IPFS</h3>
          <p className="text-sm text-muted-foreground">
            Decentralized file storage via Pinata Cloud
          </p>
        </div>

        {!uploadResult ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                className="mt-1"
                accept="image/*,.json,.txt,.pdf"
              />
            </div>

            {selectedFile && (
              <div>
                <Label htmlFor="name">File Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={selectedFile.name}
                  className="mt-1"
                />
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to IPFS
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-success font-medium">✅ Upload Successful!</div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">IPFS Hash</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                    {uploadResult.ipfsHash}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(uploadResult.ipfsHash)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Gateway URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono truncate">
                    {uploadResult.gatewayUrl}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(uploadResult.gatewayUrl)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(uploadResult.gatewayUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                File: {uploadResult.name} ({(uploadResult.size / 1024).toFixed(1)} KB)
              </div>
            </div>

            <Button 
              onClick={() => {
                setUploadResult(null);
                setSelectedFile(null);
                setFileName('');
              }}
              variant="outline"
              className="w-full"
            >
              Upload Another File
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default IPFSUpload;