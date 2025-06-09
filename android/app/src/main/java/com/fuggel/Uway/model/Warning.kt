package com.fuggel.Uway.model

import com.fuggel.Uway.constants.Constants

data class Warning(
    val type: String?,
    val state: String?,
    val text: String?,
    val tts: String?,
    val eventWarningType: String?,
)

object WarningLogic {
    fun isValid(warning: Warning): Boolean {
        return !warning.type.isNullOrBlank() &&
                !warning.state.isNullOrBlank() &&
                !warning.text.isNullOrBlank() &&
                !warning.tts.isNullOrBlank() &&
                Constants.VALID_WARNING_TYPES.contains(warning.type) &&
                Constants.VALID_WARNING_STATES.contains(warning.state)
    }
}