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

        // Verifica se a notificação possui padrão financeiro
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

        // Cria o gasto
        val gasto = Gasto(
            id = UUID.randomUUID().toString(),
            valor = value,
            titulo = title,
            descricao = text,
            pacoteOrigem = packageName,
            dataHora = System.currentTimeMillis()
        )

        // Abre o banco local
        val database =
            GastoDatabaseHelper(applicationContext)

        // Insere o gasto no SQLite
        val inserido =
            database.inserirGasto(gasto)

        if (inserido) {

            // Conta quantos gastos existem no banco
            val totalGastos =
                database.contarGastos()

            Log.e(
                "NoteGranaNotification",
                "GASTO SALVO NO SQLITE - R$ ${gasto.valor}"
            )

            Log.e(
                "NoteGranaNotification",
                "TOTAL DE GASTOS NO SQLITE: $totalGastos"
            )

            // Mantemos o SharedPreferences somente
            // como apoio para os testes desta etapa
            getSharedPreferences(
                "notegrana_notifications",
                MODE_PRIVATE
            )
                .edit()
                .putString(
                    "status",
                    "GASTO_SALVO_NO_SQLITE"
                )
                .putString("package", packageName)
                .putString("titulo", title)
                .putString("texto", text)
                .putString("valor", value.toString())
                .putString("id", gasto.id)
                .putInt("total_gastos", totalGastos)
                .apply()

        } else {
            Log.e(
                "NoteGranaNotification",
                "ERRO AO SALVAR GASTO NO SQLITE"
            )
        }
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()

        Log.e(
            "NoteGranaNotification",
            "SERVICO DESCONECTADO"
        )
    }
}