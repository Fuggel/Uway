package com.fuggel.Uway.network

import com.fuggel.Uway.constants.Constants
import okhttp3.*
import java.io.IOException

object DirectionsClient {
    private val client = OkHttpClient()

    fun fetchDirections(
        authToken: String,
        startLat: Double,
        startLon: Double,
        destinationCoordinates: String,
        excludeTypes: String,
        profileType: String,
        onSuccess: (String) -> Unit,
        onError: (Exception) -> Unit
    ) {
        val destinationParts = destinationCoordinates.split(",")
        if (destinationParts.size != 2) {
            onError(IllegalArgumentException("Invalid destinationCoordinates"))
            return
        }

        val destLon = destinationParts[0]
        val destLat = destinationParts[1]

        val urlBuilder = HttpUrl.Builder()
            .scheme("http")
            .host(Constants.UWAY_BACKEND_HOST)
            .port(Constants.UWAY_BACKEND_PORT)
            .addPathSegment("api")
            .addPathSegment("directions")
            .addQueryParameter("profile", profileType)
            .addQueryParameter("startCoordinates", "$startLon,$startLat")
            .addQueryParameter("destinationCoordinates", "$destLon,$destLat")

        if (excludeTypes.isNotEmpty()) {
            urlBuilder.addQueryParameter("exclude", excludeTypes)
        }

        val url = urlBuilder.build()
        val request = Request.Builder()
            .url(url)
            .header("Authorization", "Bearer $authToken")
            .get()
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                onError(e)
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!response.isSuccessful) {
                        onError(IOException("Unexpected code $response"))
                        return
                    }

                    val body = response.body?.string()
                    if (body != null) {
                        onSuccess(body)
                    } else {
                        onError(IOException("Empty response body"))
                    }
                }
            }
        })
    }
}
