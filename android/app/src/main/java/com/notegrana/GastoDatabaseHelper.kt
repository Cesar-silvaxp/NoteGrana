package com.notegrana

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class GastoDatabaseHelper(
    context: Context
) : SQLiteOpenHelper(
    context,
    DATABASE_NAME,
    null,
    DATABASE_VERSION
) {

    override fun onCreate(
        db: SQLiteDatabase
    ) {
        val sql = """
            CREATE TABLE $TABLE_GASTOS (
                id TEXT PRIMARY KEY,
                valor REAL NOT NULL,
                titulo TEXT NOT NULL,
                descricao TEXT NOT NULL,
                pacote_origem TEXT NOT NULL,
                data_hora INTEGER NOT NULL,
                status TEXT NOT NULL,
                api_id INTEGER,
                sincronizado INTEGER NOT NULL DEFAULT 0,
                usuario_id INTEGER
            )
        """.trimIndent()

        db.execSQL(sql)

        criarIndiceUsuario(db)
    }

    override fun onUpgrade(
        db: SQLiteDatabase,
        oldVersion: Int,
        newVersion: Int
    ) {
        if (oldVersion < 2) {
            db.execSQL(
                """
                ALTER TABLE $TABLE_GASTOS
                ADD COLUMN api_id INTEGER
                """.trimIndent()
            )

            db.execSQL(
                """
                ALTER TABLE $TABLE_GASTOS
                ADD COLUMN sincronizado
                INTEGER NOT NULL DEFAULT 0
                """.trimIndent()
            )
        }

        if (oldVersion < 3) {
            db.execSQL(
                """
                ALTER TABLE $TABLE_GASTOS
                ADD COLUMN usuario_id INTEGER
                """.trimIndent()
            )

            criarIndiceUsuario(db)
        }
    }

    private fun criarIndiceUsuario(
        db: SQLiteDatabase
    ) {
        db.execSQL(
            """
            CREATE INDEX IF NOT EXISTS
            idx_gastos_usuario_id
            ON $TABLE_GASTOS(usuario_id)
            """.trimIndent()
        )
    }

    fun existeGastoDuplicado(
        usuarioId: Long,
        valor: Double,
        titulo: String,
        descricao: String,
        pacoteOrigem: String,
        dataHora: Long,
        janelaMs: Long =
            JANELA_DUPLICIDADE_MS
    ): Boolean {

        if (usuarioId <= 0) {
            return false
        }

        val inicioJanela =
            dataHora - janelaMs

        val fimJanela =
            dataHora + janelaMs

        val db =
            readableDatabase

        val cursor =
            db.rawQuery(
                """
                SELECT 1
                FROM $TABLE_GASTOS
                WHERE usuario_id = ?
                  AND valor = ?
                  AND titulo = ?
                  AND descricao = ?
                  AND pacote_origem = ?
                  AND data_hora BETWEEN ? AND ?
                LIMIT 1
                """.trimIndent(),
                arrayOf(
                    usuarioId.toString(),
                    valor.toString(),
                    titulo,
                    descricao,
                    pacoteOrigem,
                    inicioJanela.toString(),
                    fimJanela.toString()
                )
            )

        val existe =
            cursor.use {
                it.moveToFirst()
            }

        db.close()

        return existe
    }

    fun inserirGasto(
        gasto: Gasto
    ): Boolean {
        val usuarioId =
            gasto.usuarioId
                ?: return false

        if (usuarioId <= 0) {
            return false
        }

        val db =
            writableDatabase

        val values =
            ContentValues().apply {
                put(
                    "id",
                    gasto.id
                )

                put(
                    "valor",
                    gasto.valor
                )

                put(
                    "titulo",
                    gasto.titulo
                )

                put(
                    "descricao",
                    gasto.descricao
                )

                put(
                    "pacote_origem",
                    gasto.pacoteOrigem
                )

                put(
                    "data_hora",
                    gasto.dataHora
                )

                put(
                    "status",
                    gasto.status
                )

                if (gasto.apiId != null) {
                    put(
                        "api_id",
                        gasto.apiId
                    )
                }

                put(
                    "sincronizado",
                    if (gasto.sincronizado) {
                        1
                    } else {
                        0
                    }
                )

                put(
                    "usuario_id",
                    usuarioId
                )
            }

        val resultado =
            db.insert(
                TABLE_GASTOS,
                null,
                values
            )

        db.close()

        return resultado != -1L
    }

    fun listarGastos(
        usuarioId: Long
    ): List<Gasto> {

        if (usuarioId <= 0) {
            return emptyList()
        }

        val gastos =
            mutableListOf<Gasto>()

        val db =
            readableDatabase

        val cursor =
            db.query(
                TABLE_GASTOS,
                null,
                "usuario_id = ?",
                arrayOf(
                    usuarioId.toString()
                ),
                null,
                null,
                "data_hora ASC"
            )

        cursor.use {
            while (
                it.moveToNext()
            ) {
                gastos.add(
                    converterCursorParaGasto(
                        it
                    )
                )
            }
        }

        db.close()

        return gastos
    }

    fun listarGastosPendentes(
        usuarioId: Long
    ): List<Gasto> {

        if (usuarioId <= 0) {
            return emptyList()
        }

        val gastos =
            mutableListOf<Gasto>()

        val db =
            readableDatabase

        val cursor =
            db.query(
                TABLE_GASTOS,
                null,
                """
                sincronizado = ?
                AND usuario_id = ?
                """.trimIndent(),
                arrayOf(
                    "0",
                    usuarioId.toString()
                ),
                null,
                null,
                "data_hora ASC"
            )

        cursor.use {
            while (
                it.moveToNext()
            ) {
                gastos.add(
                    converterCursorParaGasto(
                        it
                    )
                )
            }
        }

        db.close()

        return gastos
    }

    fun marcarGastoSincronizado(
        idLocal: String,
        apiId: Long,
        usuarioId: Long
    ): Boolean {

        if (usuarioId <= 0) {
            return false
        }

        val db =
            writableDatabase

        val values =
            ContentValues().apply {
                put(
                    "api_id",
                    apiId
                )

                put(
                    "sincronizado",
                    1
                )
            }

        val linhasAtualizadas =
            db.update(
                TABLE_GASTOS,
                values,
                """
                id = ?
                AND usuario_id = ?
                """.trimIndent(),
                arrayOf(
                    idLocal,
                    usuarioId.toString()
                )
            )

        db.close()

        return linhasAtualizadas > 0
    }

    fun marcarGastoPendente(
        id: String,
        usuarioId: Long
    ): Boolean {

        if (usuarioId <= 0) {
            return false
        }

        val db =
            writableDatabase

        val values =
            ContentValues().apply {
                put(
                    "sincronizado",
                    0
                )
            }

        val linhasAtualizadas =
            db.update(
                TABLE_GASTOS,
                values,
                """
                id = ?
                AND usuario_id = ?
                """.trimIndent(),
                arrayOf(
                    id,
                    usuarioId.toString()
                )
            )

        db.close()

        return linhasAtualizadas > 0
    }

    fun buscarApiId(
        idLocal: String,
        usuarioId: Long
    ): Long? {

        if (usuarioId <= 0) {
            return null
        }

        val db =
            readableDatabase

        val cursor =
            db.query(
                TABLE_GASTOS,
                arrayOf(
                    "api_id"
                ),
                """
                id = ?
                AND usuario_id = ?
                """.trimIndent(),
                arrayOf(
                    idLocal,
                    usuarioId.toString()
                ),
                null,
                null,
                null
            )

        var apiId: Long? =
            null

        cursor.use {
            if (
                it.moveToFirst()
            ) {
                val indice =
                    it.getColumnIndexOrThrow(
                        "api_id"
                    )

                if (!it.isNull(indice)) {
                    apiId =
                        it.getLong(indice)
                }
            }
        }

        db.close()

        return apiId
    }

    fun atualizarStatusGasto(
        id: String,
        status: String,
        usuarioId: Long
    ): Boolean {

        if (usuarioId <= 0) {
            return false
        }

        val db =
            writableDatabase

        val values =
            ContentValues().apply {
                put(
                    "status",
                    status
                )

                put(
                    "sincronizado",
                    0
                )
            }

        val linhasAtualizadas =
            db.update(
                TABLE_GASTOS,
                values,
                """
                id = ?
                AND usuario_id = ?
                """.trimIndent(),
                arrayOf(
                    id,
                    usuarioId.toString()
                )
            )

        db.close()

        return linhasAtualizadas > 0
    }

    fun contarGastos(
        usuarioId: Long
    ): Int {

        if (usuarioId <= 0) {
            return 0
        }

        val db =
            readableDatabase

        val cursor =
            db.rawQuery(
                """
                SELECT COUNT(*)
                FROM $TABLE_GASTOS
                WHERE usuario_id = ?
                """.trimIndent(),
                arrayOf(
                    usuarioId.toString()
                )
            )

        var total = 0

        cursor.use {
            if (
                it.moveToFirst()
            ) {
                total =
                    it.getInt(0)
            }
        }

        db.close()

        return total
    }

    private fun converterCursorParaGasto(
        cursor: Cursor
    ): Gasto {

        val apiIdIndex =
            cursor.getColumnIndexOrThrow(
                "api_id"
            )

        val apiId =
            if (
                cursor.isNull(
                    apiIdIndex
                )
            ) {
                null
            } else {
                cursor.getLong(
                    apiIdIndex
                )
            }

        val sincronizado =
            cursor.getInt(
                cursor.getColumnIndexOrThrow(
                    "sincronizado"
                )
            ) == 1

        val usuarioIdIndex =
            cursor.getColumnIndexOrThrow(
                "usuario_id"
            )

        val usuarioId =
            if (
                cursor.isNull(
                    usuarioIdIndex
                )
            ) {
                null
            } else {
                cursor.getLong(
                    usuarioIdIndex
                )
            }

        return Gasto(
            id =
                cursor.getString(
                    cursor.getColumnIndexOrThrow(
                        "id"
                    )
                ),

            valor =
                cursor.getDouble(
                    cursor.getColumnIndexOrThrow(
                        "valor"
                    )
                ),

            titulo =
                cursor.getString(
                    cursor.getColumnIndexOrThrow(
                        "titulo"
                    )
                ),

            descricao =
                cursor.getString(
                    cursor.getColumnIndexOrThrow(
                        "descricao"
                    )
                ),

            pacoteOrigem =
                cursor.getString(
                    cursor.getColumnIndexOrThrow(
                        "pacote_origem"
                    )
                ),

            dataHora =
                cursor.getLong(
                    cursor.getColumnIndexOrThrow(
                        "data_hora"
                    )
                ),

            status =
                cursor.getString(
                    cursor.getColumnIndexOrThrow(
                        "status"
                    )
                ),

            apiId =
                apiId,

            sincronizado =
                sincronizado,

            usuarioId =
                usuarioId
        )
    }

    companion object {
        private const val DATABASE_NAME =
            "notegrana.db"

        private const val DATABASE_VERSION =
            3

        private const val JANELA_DUPLICIDADE_MS =
            5_000L

        const val TABLE_GASTOS =
            "gastos"
    }
}