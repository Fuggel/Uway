//
//  UwaySocketManager.swift
//  Uway
//
//  Created by Furkan Ceylan on 27.06.25.
//

import Foundation
import SocketIO
import CoreLocation

class UwaySocketManager {
    
    static let shared = UwaySocketManager()

    private var manager: SocketManager?
    private var socket: SocketIOClient?
    private var authToken: String = ""
    private var isConnected = false

    private var onWarning: (([String: Any]) -> Void)?

    private init() {}

    func connect(authToken: String, url: String, onWarning: @escaping ([String: Any]) -> Void) {
        guard !isConnected else {
            print("socket: already connected")
            return
        }

        self.authToken = authToken
        self.onWarning = onWarning

        guard let socketUrl = URL(string: url) else {
            print("socket: invalid URL")
            return
        }

        manager = SocketManager(
            socketURL: socketUrl,
            config: [
                .log(true),
                .compress,
                .forceNew(true),
                .connectParams(["token": authToken])
            ]
        )

        socket = manager?.defaultSocket

        socket?.on(clientEvent: .connect) { _, _ in
            self.isConnected = true
            print("socket: connected")
        }

        socket?.on("warning-manager") { dataArray, _ in
            if let data = dataArray.first as? [String: Any] {
                print("socket: received warning → \(data)")
                self.onWarning?(data)
            } else {
                print("socket: invalid warning payload → \(dataArray)")
            }
        }

        socket?.connect()
    }

    func emitLocation(eventType: String, location: CLLocation, heading: Double?, speed: Double?, userId: String?) {
        guard isConnected else {
            print("socket: not connected, skipping emit")
            return
        }

        let payload: [String: Any] = [
            "eventType": eventType,
            "lon": location.coordinate.longitude,
            "lat": location.coordinate.latitude,
            "heading": heading ?? 0.0,
            "speed": speed ?? 0.0,
            "userId": userId ?? UUID().uuidString,
            "eventWarningType": NSNull()
        ]

        socket?.emit("user-location", payload)
        print("socket: emitted user-location → \(payload)")
    }

    func disconnect() {
        print("socket: disconnecting")
        socket?.disconnect()
        socket?.removeAllHandlers()
        socket = nil
        manager = nil
        isConnected = false
    }
}

