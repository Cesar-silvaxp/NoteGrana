package com.notegrana

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import java.util.UUID

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

        // Ignora aplicativos definidos na blacklist
        if (NotificationProcessor.isIgnoredApp(packageName)) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - App: $packageName"
            )

            return
        }

        // Verifica se a notificação representa uma transação financeira
        val financial =
            NotificationProcessor.isFinancialTransaction(
                title,
                text
            )

        if (!financial) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - Sem padrao financeiro"
            )

            return
        }

        // Extrai o valor da transação
        val value =
            NotificationProcessor.extractValue(
                title,
                text
            )

        if (value == null) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - Valor nao encontrado"
            )

            return
        }

        // Cria automaticamente o gasto
        val gasto = Gasto(
            id = UUID.randomUUID().toString(),
            valor = value,
            titulo = title,
            descricao = text,
            pacoteOrigem = packageName,
            dataHora = System.currentTimeMillis()
        )

        // Salva o último gasto registrado para validação
        getSharedPreferences(
            "notegrana_ultimo_gasto",
            MODE_PRIVATE
        )
            .edit()
            .putString("id", gasto.id)
            .putString("valor", gasto.valor.toString())
            .putString("titulo", gasto.titulo)
            .putString("descricao", gasto.descricao)
            .putString("package", gasto.pacoteOrigem)
            .putLong("dataHora", gasto.dataHora)
            .putString("status", gasto.status)
            .apply()

        // Mantém também os dados técnicos da notificação
        getSharedPreferences(
            "notegrana_notifications",
            MODE_PRIVATE
        )
            .edit()
            .putString(
                "status",
                "GASTO_REGISTRADO_AUTOMATICAMENTE"
            )
            .putString("package", packageName)
            .putString("titulo", title)
            .putString("texto", text)
            .putString("valor", value.toString())
            .apply()

        Log.e(
            "NoteGranaNotification",
            "GASTO REGISTRADO - R$ ${gasto.valor}"
        )
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()

        Log.e(
            "NoteGranaNotification",
            "SERVICO DESCONECTADO"
        )
    }
}