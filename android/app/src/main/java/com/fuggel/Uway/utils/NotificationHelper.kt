package com.fuggel.Uway.utils

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.fuggel.Uway.R
import com.fuggel.Uway.constants.Constants
import com.fuggel.Uway.MainActivity

object NotificationHelper {
    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val navChannel = NotificationChannel(
                Constants.NAVIGATION_CHANNEL_ID,
                context.getString(R.string.notification_channel_name),
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = context.getString(R.string.notification_channel_description)
                setSound(null, null)
                enableVibration(false)
                enableLights(false)
            }

            val alertChannel = NotificationChannel(
                Constants.ALERT_CHANNEL_ID,
                context.getString(R.string.notification_alert_channel_name),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = context.getString(R.string.notification_alert_channel_description)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 250, 500)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }

            val manager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(navChannel)
            manager.createNotificationChannel(alertChannel)
        }
    }

    fun buildNotification(context: Context): Notification {
        return NotificationCompat.Builder(context, Constants.NAVIGATION_CHANNEL_ID)
            .setContentTitle(context.getString(R.string.notification_build_title))
            .setContentText(context.getString(R.string.notification_build_content))
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()
    }

    fun showNotification(
        context: Context,
        title: String,
        message: String,
        icon: Int = R.drawable.uway
    ) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification = NotificationCompat.Builder(context, Constants.ALERT_CHANNEL_ID)
            .setSmallIcon(icon)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setDefaults(Notification.DEFAULT_ALL)
            .setVibrate(longArrayOf(0, 500, 250, 500))
            .setFullScreenIntent(pendingIntent, true)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(Constants.WARNING_NOTIFICATION_ID, notification)
    }
}
