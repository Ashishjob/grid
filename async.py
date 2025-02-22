import serial
import serial.tools.list_ports
import websockets
import asyncio
import json
from datetime import datetime

def list_available_ports():
    ports = serial.tools.list_ports.comports()
    if not ports:
        return "No ports found! Make sure you have permission to access serial ports."
    
    return "\n".join(f"- {port.device} ({port.description})" for port in ports)

async def read_and_forward():
    # First list all available ports
    print("\nAvailable ports:")
    print(list_available_ports())
    
    try:
        # Initialize serial connection
        print(f"\nAttempting to connect to {SERIAL_PORT}...")
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print("Serial connection established!")
        
        message_count = 0
        last_time = datetime.now()

        async def handler(websocket):
            nonlocal message_count, last_time
            print(f"\nNew WebSocket client connected!")
            
            while True:
                try:
                    if ser.in_waiting:
                        line = ser.readline().decode('utf-8').strip()
                        message_count += 1
                        
                        # Print message count every second
                        current_time = datetime.now()
                        if (current_time - last_time).seconds >= 1:
                            print(f"\nMessages received in last second: {message_count}")
                            print(f"Latest data: {line}")
                            message_count = 0
                            last_time = current_time
                        
                        try:
                            # Validate it's proper JSON
                            data = json.loads(line)
                            # Send to client
                            await websocket.send(line)
                        except json.JSONDecodeError:
                            print(f"\nInvalid JSON received: {line}")
                            
                except Exception as e:
                    print(f"\nError processing data: {str(e)}")
                
                await asyncio.sleep(0.1)

        print("\nStarting WebSocket server...")
        async with websockets.serve(handler, "localhost", 8765):
            print("\nWebSocket server is running!")
            print("You can now connect to ws://localhost:8765")
            await asyncio.Future()  # run forever

    except serial.SerialException as e:
        print(f"\nError: Could not open port {SERIAL_PORT}")
        print(f"Error details: {str(e)}")
        print("\nPlease check:")
        print("1. Is your Arduino connected?")
        print("2. Is the correct port selected?")
        print("3. Do you have permission to access the port?")
        print("4. Is the Arduino IDE Serial Monitor closed?")
        return

if __name__ == "__main__":
    # Configuration for macOS
    SERIAL_PORT = '/dev/cu.usbmodem1101'  # Your Arduino port
    BAUD_RATE = 9600

    print("Energy Monitor Bridge Starting...")
    print("--------------------------------")
    
    try:
        asyncio.run(read_and_forward())
    except KeyboardInterrupt:
        print("\nShutting down...")
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")