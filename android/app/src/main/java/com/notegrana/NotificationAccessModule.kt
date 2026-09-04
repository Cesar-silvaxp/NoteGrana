package com.notegrana

import android.content.ComponentName
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationAccessModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NotificationAccessModule"
    }

    /**
     * Verifica se o NotificationListener do NoteGrana
     * está autorizado pelo usuário nas configurações do Android.
     */
    @ReactMethod
    fun verificarAcesso(promise: Promise) {
        try {
            val context = reactApplicationContext

            val componenteNoteGrana = ComponentName(
                context,
                NotificationListener::class.java
            )

            val listenersAtivos =
                Settings.Secure.getString(
                    context.contentResolver,
                    "enabled_notification_listeners"
                ) ?: ""

            val acessoPermitido =
                listenersAtivos
                    .split(":")
                    .mapNotNull { item ->
                        ComponentName.unflattenFromString(item)
                    }
                    .any { componente ->
                        componente == componenteNoteGrana
                    }

            promise.resolve(acessoPermitido)

        } catch (e: Exception) {
            promise.reject(
                "ERRO_VERIFICAR_ACESSO",
                "Não foi possível verificar o acesso às notificações.",
                e
            )
        }
    }

    /**
     * Abre a tela do Android onde o usuário pode
     * autorizar o acesso às notificações.
     */
    @ReactMethod
    fun abrirConfiguracoes(promise: Promise) {
        try {
            val context = reactApplicationContext

            val intent = Intent(
                Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS
            ).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            context.startActivity(intent)

            promise.resolve(true)

        } catch (e: Exception) {
            try {
                // Fallback caso algum fabricante não suporte
                // diretamente a tela de acesso às notificações.
                val intent = Intent(
                    Settings.ACTION_SETTINGS
                ).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }

                reactApplicationContext.startActivity(intent)

                promise.resolve(true)

            } catch (fallbackException: Exception) {
                promise.reject(
                    "ERRO_ABRIR_CONFIGURACOES",
                    "Não foi possível abrir as configurações do Android.",
                    fallbackException
                )
            }
        }
    }
}