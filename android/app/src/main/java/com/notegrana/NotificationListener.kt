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

        getSharedPreferences(
            "notegrana_notifications",
            MODE_PRIVATE
        )
            .edit()
            .putString("status", "SERVICO_CONECTADO")
            .apply()
    }

    override fun onNotificationPosted(
        sbn: StatusBarNotification?
    ) {
        super.onNotificationPosted(sbn)

        val notification = sbn?.notification ?: return
        val extras = notification.extras

        val title =
            extras.getCharSequence("android.title")
                ?.toString()
                ?: ""

        val text =
            extras.getCharSequence("android.text")
                ?.toString()
                ?: ""

        val packageName = sbn.packageName ?: ""

        if (NotificationProcessor.isIgnoredApp(packageName)) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - App: $packageName"
            )

            return
        }

        val financial =
            NotificationProcessor.isFinancialTransaction(
                title,
                text
            )

        if (!financial) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - Sem padrão financeiro"
            )

            return
        }

        val value =
            NotificationProcessor.extractValue(
                title,
                text
            )

        if (value == null) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - Valor não encontrado"
            )

            return
        }

        Log.e(
            "NoteGranaNotification",
            "TRANSACAO IDENTIFICADA - R$ $value"
        )

        getSharedPreferences(
            "notegrana_notifications",
            MODE_PRIVATE
        )
            .edit()
            .putString(
                "status",
                "TRANSACAO_FINANCEIRA_IDENTIFICADA"
            )
            .putString("package", packageName)
            .putString("titulo", title)
            .putString("texto", text)
            .putString("valor", value.toString())
            .apply()
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()

        Log.e(
            "NoteGranaNotification",
            "SERVICO DESCONECTADO"
        )
    }
}