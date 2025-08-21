import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DebugCamera() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCamera = async () => {
    setIsLoading(true);
    setLogs([]);
    
    try {
      addLog('🔍 Starting camera test...');
      
      // Test 1: Check if browser supports camera
      addLog('📱 Checking browser support...');
      if (!navigator.mediaDevices) {
        addLog('❌ navigator.mediaDevices not supported');
        return;
      }
      addLog('✅ navigator.mediaDevices supported');
      
      if (!navigator.mediaDevices.getUserMedia) {
        addLog('❌ getUserMedia not supported');
        return;
      }
      addLog('✅ getUserMedia supported');
      
      // Test 2: Check available devices
      addLog('📷 Checking available cameras...');
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        addLog(`📷 Found ${videoDevices.length} video devices`);
        videoDevices.forEach((device, index) => {
          addLog(`  ${index + 1}. ${device.label || 'Unknown Camera'} (${device.deviceId.substring(0, 8)}...)`);
        });
      } catch (err) {
        addLog(`⚠️ Could not enumerate devices: ${err}`);
      }
      
      // Test 3: Request camera access
      addLog('🎥 Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      addLog('✅ Camera access granted!');
      addLog(`📺 Stream tracks: ${stream.getVideoTracks().length}`);
      
      // Stop the stream
      stream.getTracks().forEach(track => {
        track.stop();
        addLog(`🛑 Stopped track: ${track.kind}`);
      });
      
      addLog('🎉 Camera test completed successfully!');
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.name} - ${error.message}`);
      
      if (error.name === 'NotAllowedError') {
        addLog('💡 Solution: Click Allow when browser asks for camera permission');
      } else if (error.name === 'NotFoundError') {
        addLog('💡 Solution: Connect a camera or check device manager');
      } else if (error.name === 'NotReadableError') {
        addLog('💡 Solution: Close other apps using camera (Zoom, Teams, etc.)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Camera Debug Test</h2>
      
      <div className="space-x-2">
        <Button onClick={testCamera} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test Camera'}
        </Button>
        <Button onClick={clearLogs} variant="outline">
          Clear Logs
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
        <h3 className="font-medium mb-2">Debug Logs:</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500">Click "Test Camera" to start debugging...</p>
        ) : (
          <div className="space-y-1 font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}