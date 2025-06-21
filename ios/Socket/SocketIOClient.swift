//
//  SocketIOClient.swift
//  Uway
//
//  Created by Furkan Ceylan on 20.06.25.
//

import Foundation
import SocketIO

class SocketClient {
    private var manager: SocketManager!
    private var socket: SocketIO.SocketIOClient!
    private let authToken: String
    
    var onMessageReceived: ((String) -> Void)?
    
    init(authToken: String) {
        self.authToken = authToken
        
        let url = URL(string: AppConfig.uwayWsUrl)!
        manager = SocketManager(
            socketURL: url,
            config: [
                .log(true),
                .compress,
                .connectParams(["token": authToken])
            ]
        )
        socket = manager.defaultSocket
    }
    
    func connect() {
        socket.on(clientEvent: .connect) { _, _ in
            print("Socket connected")
        }
        
        socket.on("warning") { [weak self] data, _ in
            if let message = data.first as? String {
                self?.onMessageReceived?(message)
            } else if let dict = data.first as? [String: Any],
                      let jsonData = try? JSONSerialization.data(withJSONObject: dict),
                      let jsonString = String(data: jsonData, encoding: .utf8) {
                self?.onMessageReceived?(jsonString)
            }
        }
        
        socket.on(clientEvent: .disconnect) { _, _ in
            print("Socket disconnected")
        }
        
        socket.on(clientEvent: .error) { data, _ in
            print("Socket error: \(data)")
        }
        
        socket.connect()
    }
    
    func sendLocation(
        eventType: String,
        lon: Double,
        lat: Double,
        heading: Double,
        speed: Double
    ) {
        let userId = UUID().uuidString
        let json: [String: Any] = [
            "eventType": eventType,
            "lon": lon,
            "lat": lat,
            "heading": heading,
            "speed": speed,
            "userId": userId,
            "eventWarningType": NSNull()
        ]
        
        socket.emit("location", json)
    }
    
    func disconnect() {
        socket.disconnect()
    }
}
