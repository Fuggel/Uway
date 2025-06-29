//
//  DirectionsService.swift
//  Uway
//
//  Created by Furkan Ceylan on 29.06.25.
//

import Foundation
import CoreLocation

class DirectionsService {

    static func fetch(
        authToken: String,
        start: CLLocationCoordinate2D,
        destination: String,
        profile: String,
        exclude: String?,
        selectedRouteIndex: Int,
        completion: @escaping (_ instructions: [Instruction]?) -> Void
    ) {
        let urlString = buildUrl(
            profile: profile,
            start: start,
            destination: destination,
            exclude: exclude
        )

        guard let url = URL(string: urlString) else {
            print("directions: invalid URL")
            completion(nil)
            return
        }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        request.httpMethod = "GET"

        print("directions: fetching from → \(urlString)")

        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                print("directions: fetch failed → \(error.localizedDescription)")
                completion(nil)
                return
            }

            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let dataObj = json["data"] as? [String: Any],
                  let routes = dataObj["routes"] as? [[String: Any]] else {
                print("directions: invalid response format")
                completion(nil)
                return
            }

            let index = min(selectedRouteIndex, routes.count - 1)
            let route = routes[index]
            let instructions = InstructionHelper.parse(routeJson: route)

            print("directions: parsed \(instructions.count) instructions")
            completion(instructions)
        }.resume()
    }

    private static func buildUrl(
        profile: String,
        start: CLLocationCoordinate2D,
        destination: String,
        exclude: String?
    ) -> String {
        var components = URLComponents(string: AppConfig.uwayApiUrl + "/directions")!
        var query: [URLQueryItem] = [
            URLQueryItem(name: "profile", value: profile),
            URLQueryItem(name: "startCoordinates", value: "\(start.longitude),\(start.latitude)"),
            URLQueryItem(name: "destinationCoordinates", value: destination)
        ]
        if let exclude = exclude {
            query.append(URLQueryItem(name: "exclude", value: exclude))
        }
        components.queryItems = query
        return components.url!.absoluteString
    }
}

