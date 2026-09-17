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
                sincronizado INTEGER NOT NULL DEFAULT 0
            )
        """.trimIndent()

        db.execSQL(sql)
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
    }

    fun inserirGasto(
        gasto: Gasto
    ): Boolean {
        val db = writableDatabase

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
                    if (
                        gasto.sincronizado
                    ) {
                        1
                    } else {
                        0
                    }
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

    fun listarGastos():
        List<Gasto> {

        val gastos =
            mutableListOf<Gasto>()

        val db =
            readableDatabase

        val cursor =
            db.query(
                TABLE_GASTOS,
                null,
                null,
                null,
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

    fun listarGastosPendentes():
        List<Gasto> {

        val gastos =
            mutableListOf<Gasto>()

        val db =
            readableDatabase

        val cursor =
            db.query(
                TABLE_GASTOS,
                null,
                "sincronizado = ?",
                arrayOf("0"),
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
        apiId: Long
    ): Boolean {
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
                "id = ?",
                arrayOf(idLocal)
            )

        db.close()

        return linhasAtualizadas > 0
    }

    fun marcarGastoPendente(
        id: String
    ): Boolean {
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
                "id = ?",
                arrayOf(id)
            )

        db.close()

        return linhasAtualizadas > 0
    }

    fun buscarApiId(
        idLocal: String
    ): Long? {
        val db =
            readableDatabase

        val cursor =
            db.query(
                TABLE_GASTOS,
                arrayOf("api_id"),
                "id = ?",
                arrayOf(idLocal),
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
        status: String
    ): Boolean {
        val db =
            writableDatabase

        val values =
            ContentValues().apply {
                put(
                    "status",
                    status
                )

                /*
                 * Alterou localmente:
                 * precisa sincronizar
                 * novamente com a API.
                 */
                put(
                    "sincronizado",
                    0
                )
            }

        val linhasAtualizadas =
            db.update(
                TABLE_GASTOS,
                values,
                "id = ?",
                arrayOf(id)
            )

        db.close()

        return linhasAtualizadas > 0
    }

    fun contarGastos(): Int {
        val db =
            readableDatabase

        val cursor =
            db.rawQuery(
                """
                SELECT COUNT(*)
                FROM $TABLE_GASTOS
                """.trimIndent(),
                null
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
                sincronizado
        )
    }

    companion object {
        private const val DATABASE_NAME =
            "notegrana.db"

        private const val DATABASE_VERSION =
            2

        const val TABLE_GASTOS =
            "gastos"
    }
}