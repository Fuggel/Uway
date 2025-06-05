package com.fuggel.Uway.navigation

import android.content.Context
import android.location.Location
import com.fuggel.Uway.model.Instruction

object InstructionsHolder {
    private var manager: InstructionsManager? = null

    fun init(steps: List<Instruction>) {
        manager = InstructionsManager(steps)
    }

    fun updateLocation(location: Location, context: Context) {
        if (manager == null) {
            println("InstructionsHolder: Manager is not initialized. Please call init() first.")
        } else {
            println("InstructionsHolder: Updating location: ${location.latitude}, ${location.longitude}")
            manager?.updateLocation(location, context)
        }
    }

    fun clear() {
        manager = null
    }
}
