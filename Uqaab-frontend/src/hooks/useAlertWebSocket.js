import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { apiSlice } from '../store/apiSlice'; // Adjust path if needed

// We need to convert http:// to ws:// for the WebSocket
const BASE_HTTP_URL = 'http://192.168.18.85:8000';
const WS_URL = BASE_HTTP_URL.replace('http', 'ws') + '/api/v1/ws/alerts';

export const useAlertWebSocket = (propertyId) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const ws = useRef(null);

  useEffect(() => {
    if (!propertyId || !token) return;

    // 1. Connect to the FastAPI WebSocket
    const connectUrl = `${WS_URL}/${propertyId}?token=${token}`;
    ws.current = new WebSocket(connectUrl);

    ws.current.onopen = () => {
      console.log(`🔌 WS Connected for Property ${propertyId}`);
      // Optional: Ping every 30 seconds to keep the connection alive
      setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        }
      }, 30000);
    };

    // 2. Listen for incoming alerts!
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'new_alert') {
          console.log("🚨 INSTANT ALERT RECEIVED:", message);

          // Pop up an instant alert on the screen 
          // (You can replace this with a nice Toast notification library later!)
          Alert.alert(
            "🚨 " + message.alert_type,
            message.message,
            [{ text: "OK" }]
          );

          // 🔥 MAGIC TRICK: Instantly tell RTK Query that the database changed!
          // This forces your Dashboard and Alerts screens to automatically re-fetch
          // their data in the background, updating the UI instantly without the user doing anything.
          dispatch(apiSlice.util.invalidateTags([
            { type: 'Alerts', id: propertyId },
            { type: 'Dashboard', id: propertyId }
          ]));
        }

      } catch (error) {
        console.error("Error parsing WS message", error);
      }
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket Error:", error?.message);
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    // 3. Cleanup connection when the user leaves the screen
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [propertyId, token, dispatch]);

  return ws.current;
};