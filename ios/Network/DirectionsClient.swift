//
//  DirectionsClient.swift
//  Uway
//
//  Created by Furkan Ceylan on 19.06.25.
//

import Foundation
import CoreLocation

class DirectionsClient {
    static func fetchDirections(
        authToken: String,
        startLat: Double,
        startLon: Double,
        destinationCoordinates: String,
        excludeTypes: String,
        profileType: String,
        onSuccess: @escaping ([Instruction]) -> Void,
        onError: @escaping (Error) -> Void
    ) {
        let destinationParts = destinationCoordinates.split(separator: ",")
        guard destinationParts.count == 2,
              let destLon = destinationParts.first,
              let destLat = destinationParts.last else {
            onError(NSError(domain: "invalid_coordinates", code: 400))
            return
        }

        var components = URLComponents()
      
        guard let baseUrl = URL(string: AppConfig.uwayApiUrl) else {
            onError(NSError(domain: "invalid_base_url", code: 500))
            return
        }
      
        components.scheme = baseUrl.scheme
        components.host = baseUrl.host
        components.path = baseUrl.path + "/directions"
        components.queryItems = [
            URLQueryItem(name: "profile", value: profileType),
            URLQueryItem(name: "startCoordinates", value: "\(startLon),\(startLat)"),
            URLQueryItem(name: "destinationCoordinates", value: "\(destLon),\(destLat)")
        ]
        if !excludeTypes.isEmpty {
            components.queryItems?.append(URLQueryItem(name: "exclude", value: excludeTypes))
        }

        guard let url = components.url else {
            onError(NSError(domain: "invalid_url", code: 400))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                onError(error)
                return
            }

            guard let data = data else {
                onError(NSError(domain: "no_data", code: 400))
                return
            }

            do {
                guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let dataJson = json["data"] as? [String: Any],
                      let routes = dataJson["routes"] as? [[String: Any]],
                      !routes.isEmpty else {
                    onError(NSError(domain: "empty_routes", code: 404))
                    return
                }

                let selectedRoute = routes[0]
                let instructions = InstructionHelper.parse(routeJson: selectedRoute)
                onSuccess(instructions)
            } catch {
                onError(error)
            }
        }

        task.resume()
    }
}
