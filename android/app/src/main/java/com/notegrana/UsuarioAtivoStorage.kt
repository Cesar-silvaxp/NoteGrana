package com.notegrana

import android.content.Context

object UsuarioAtivoStorage {

    private const val PREFERENCES_NAME =
        "notegrana_session"

    private const val KEY_USUARIO_ID =
        "usuario_id"

    fun salvar(
        context: Context,
        usuarioId: Long
    ) {
        require(usuarioId > 0) {
            "ID do usuário inválido."
        }

        context
            .getSharedPreferences(
                PREFERENCES_NAME,
                Context.MODE_PRIVATE
            )
            .edit()
            .putLong(
                KEY_USUARIO_ID,
                usuarioId
            )
            .apply()
    }

    fun obter(
        context: Context
    ): Long? {

        val preferences =
            context.getSharedPreferences(
                PREFERENCES_NAME,
                Context.MODE_PRIVATE
            )

        if (
            !preferences.contains(
                KEY_USUARIO_ID
            )
        ) {
            return null
        }

        val usuarioId =
            preferences.getLong(
                KEY_USUARIO_ID,
                -1L
            )

        return if (usuarioId > 0) {
            usuarioId
        } else {
            null
        }
    }

    fun limpar(
        context: Context
    ) {
        context
            .getSharedPreferences(
                PREFERENCES_NAME,
                Context.MODE_PRIVATE
            )
            .edit()
            .remove(
                KEY_USUARIO_ID
            )
            .apply()
    }
}