package com.notegrana

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationListener : NotificationListenerService() {

    override fun onListenerConnected() {
        super.onListenerConnected()

        Log.e(
            "NoteGranaNotification",
            "SERVICO CONECTADO COM SUCESSO"
        )

        getSharedPreferences("notegrana_notifications", MODE_PRIVATE)
            .edit()
            .putString("status", "SERVICO_CONECTADO")
            .apply()
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()

        Log.e(
            "NoteGranaNotification",
            "SERVICO DESCONECTADO"
        )
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)

        val notification = sbn?.notification ?: return
        val extras = notification.extras

        val title =
            extras.getCharSequence("android.title")?.toString() ?: ""

        val text =
            extras.getCharSequence("android.text")?.toString() ?: ""

        val packageName = sbn.packageName ?: ""

        Log.e(
            "NoteGranaNotification",
            "App: $packageName | Titulo: $title | Texto: $text"
        )

        getSharedPreferences("notegrana_notifications", MODE_PRIVATE)
            .edit()
            .putString("status", "NOTIFICACAO_CAPTURADA")
            .putString("package", packageName)
            .putString("titulo", title)
            .putString("texto", text)
            .apply()
    }
}