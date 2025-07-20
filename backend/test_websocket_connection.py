#!/usr/bin/env python
"""
Test WebSocket connection to the production server
"""
import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    """Test WebSocket connection to production server"""
    vendor_id = 2  # Beta vendor ID
    url = f"wss://api.bazro.ge/ws/vendor/{vendor_id}/orders/"
    
    print(f"🧪 Testing WebSocket Connection")
    print(f"URL: {url}")
    print("=" * 60)
    
    try:
        print("🔌 Attempting to connect...")
        async with websockets.connect(url) as websocket:
            print("✅ WebSocket connected successfully!")
            
            # Send a ping to test the connection
            ping_message = {
                "type": "ping",
                "timestamp": "2025-07-20T21:58:00.000Z"
            }
            
            print(f"📤 Sending ping: {ping_message}")
            await websocket.send(json.dumps(ping_message))
            
            # Wait for pong response
            print("⏳ Waiting for pong response...")
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                data = json.loads(response)
                print(f"📥 Received: {data}")
                
                if data.get('type') == 'pong':
                    print("✅ Heartbeat test successful!")
                else:
                    print("⚠️ Unexpected response type")
                    
            except asyncio.TimeoutError:
                print("⏰ Timeout waiting for pong response")
                
            # Keep the connection open for a few seconds to see if any messages come through
            print("\n⏳ Listening for messages for 5 seconds...")
            try:
                while True:
                    message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    data = json.loads(message)
                    print(f"📥 Received message: {data}")
            except asyncio.TimeoutError:
                print("⏰ No additional messages received")
                
    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ WebSocket connection closed: {e}")
        return False
    except websockets.exceptions.InvalidURI as e:
        print(f"❌ Invalid WebSocket URI: {e}")
        return False
    except websockets.exceptions.WebSocketException as e:
        print(f"❌ WebSocket error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    
    print("\n✅ WebSocket test completed successfully!")
    return True

if __name__ == "__main__":
    print("Testing WebSocket connection to production server...")
    print("Note: This will test the vendor WebSocket endpoint")
    
    try:
        success = asyncio.run(test_websocket_connection())
        if success:
            print("\n🎉 WebSocket service is working!")
        else:
            print("\n❌ WebSocket service test failed")
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
