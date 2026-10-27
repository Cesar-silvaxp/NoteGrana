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
            .putString(
                "status",
                "SERVICO_CONECTADO"
            )
            .apply()
    }

    override fun onNotificationPosted(
        sbn: StatusBarNotification?
    ) {
        super.onNotificationPosted(sbn)

        val usuarioId =
            UsuarioAtivoStorage.obter(
                applicationContext
            )

        if (usuarioId == null) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - Nenhum usuario ativo"
            )

            return
        }

        val notification =
            sbn?.notification
                ?: return

        val extras =
            notification.extras

        val title =
            extras
                .getCharSequence(
                    "android.title"
                )
                ?.toString()
                ?: ""

        val text =
            extras
                .getCharSequence(
                    "android.text"
                )
                ?.toString()
                ?: ""

        val packageName =
            sbn.packageName
                ?: ""

        if (
            NotificationProcessor
                .isIgnoredApp(
                    packageName
                )
        ) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - App: $packageName"
            )

            return
        }

        val financial =
            NotificationProcessor
                .isFinancialTransaction(
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

        val value =
            NotificationProcessor
                .extractValue(
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

        val dataHora =
            System.currentTimeMillis()

        val database =
            GastoDatabaseHelper(
                applicationContext
            )

        /*
         * Alguns aplicativos atualizam a mesma
         * notificação logo depois de publicá-la.
         *
         * Isso pode fazer o Android chamar
         * onNotificationPosted mais de uma vez.
         *
         * Se os dados forem exatamente iguais
         * dentro de uma janela curta, ignoramos
         * a segunda captura.
         */
        val duplicado =
            database.existeGastoDuplicado(
                usuarioId =
                    usuarioId,

                valor =
                    value,

                titulo =
                    title,

                descricao =
                    text,

                pacoteOrigem =
                    packageName,

                dataHora =
                    dataHora
            )

        if (duplicado) {
            Log.d(
                "NoteGranaNotification",
                "IGNORADA - Gasto duplicado"
            )

            return
        }

        val gasto =
            Gasto(
                id =
                    UUID
                        .randomUUID()
                        .toString(),

                valor =
                    value,

                titulo =
                    title,

                descricao =
                    text,

                pacoteOrigem =
                    packageName,

                dataHora =
                    dataHora,

                usuarioId =
                    usuarioId
            )

        val inserido =
            database.inserirGasto(
                gasto
            )

        if (inserido) {
            val totalGastos =
                database.contarGastos(
                    usuarioId
                )

            Log.e(
                "NoteGranaNotification",
                "GASTO SALVO NO SQLITE - R$ ${gasto.valor}"
            )

            Log.e(
                "NoteGranaNotification",
                "TOTAL DE GASTOS DO USUARIO NO SQLITE: $totalGastos"
            )

            getSharedPreferences(
                "notegrana_notifications",
                MODE_PRIVATE
            )
                .edit()
                .putString(
                    "status",
                    "GASTO_SALVO_NO_SQLITE"
                )
                .putString(
                    "package",
                    packageName
                )
                .putString(
                    "titulo",
                    title
                )
                .putString(
                    "texto",
                    text
                )
                .putString(
                    "valor",
                    value.toString()
                )
                .putString(
                    "id",
                    gasto.id
                )
                .putInt(
                    "total_gastos",
                    totalGastos
                )
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