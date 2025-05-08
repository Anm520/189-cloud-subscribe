import db from '../DB/db.js'
import { encrypt, decrypt, setCookies, handleError } from '../unitl/index.js'
import loginFn from '../CloudServe/login.js'

const getAllTasks = async (req, result) => {
    // 查询数据
    const selectSql = 'SELECT * FROM task;'
    db.all(selectSql, [], (err, rows) => {
        if (err) {
            result.status(500).json({
                res_code: -1,
                res_message: err.message,
            })
        } else {
            result.status(200).json({
                res_code: 0,
                res_message: '查询成功',
                data: rows,
            })
        }
    })
}
/* 向指定表格插入数据
 *
 * @param {string} table - 要插入数据的表格名称
 * @param {Object} tableData - 要插入的数据，键为列名，值为要插入的值
 * @param {Object} result - 用于返回HTTP响应的对象
 */
const insertDataFn = (table, tableData, result) => {
    // 将tableData对象的键名提取出来，并用逗号连接成字符串
    const keys = Object.keys(tableData).join(', ')
    // 将tableData对象的值提取出来，用于SQL语句中的值部分
    const values = Object.values(tableData)
    // 生成占位符字符串，用于SQL语句中的值部分，每个占位符为'?'，数量与keys中键名数量相同
    const replace = Object.keys(tableData)
        .map(() => '?')
        .join(', ')
    // 构造插入数据的SQL语句
    const insertSql = `INSERT INTO ${table} (${keys}) VALUES (${replace});`
    // 执行SQL语句
    db.run(insertSql, values, function (err) {
        if (err) {
            console.error('Insertion failed: ' + err.message)
            // 如果执行失败，返回错误信息
            handleError(err, result, 'insertData')
        } else {
            // console.log(`Inserted data with rowid ${this.lastID}`)
            // 如果执行成功，返回成功信息，并记录插入数据的行ID
            result && result.status(200).json({ res_code: 0, res_message: '创建成功' })
        }
    })
}
/**
 * 更新指定表格中的数据
 *
 * @param {string} table - 要更新的表格名称
 * @param {string} updateKey - 要更新的键名
 * @param {Object} updateData - 要更新的数据，键为列名，值为要更新的值
 * @param {Object} result - 用于返回HTTP响应的对象
 */

const updateDataFn = (table, updateKey, updateData, result) => {
    return new Promise((resolve, reject) => {
        const updateKeyValue = updateData[updateKey]
        const { update_time = '', ...updates } = updateData
        delete updates[updateKey]
        const setClause = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(', ')
        const values = Object.values(updates)
        const updateSql = `UPDATE ${table} SET ${setClause}, update_time = datetime('now', '+8 hours') WHERE ${updateKey} = ?`
        const updateValues = [...values, updateKeyValue]
        db.run(updateSql, updateValues, function (err) {
            if (err) {
                handleError(err, result, 'updateDataFn')
                return reject(err)
            } else {
                //   console.log(`Updated ${this.changes} row(s)`)
                result && result.status(200).json({ res_code: 0, res_message: '更新成功' })
                return resolve()
            }
        })
    })


}
/**
 * 插入或更新指定表格中的数据
 *
 * @param {string} table - 要更新的表格名称
 * @param {string} updateKey - 要更新的键名
 * @param {Object} updateData - 要更新的数据，键为列名，值为要更新的值
 * @param {Object} result - 用于返回HTTP响应的对象
 */
const InsertOrUpdateFn = async (table, updateKey, updateData, result) => {
    const updateKeyValue = updateData[updateKey]
    const selectSql = `SELECT * FROM ${table} WHERE ${updateKey} = ?;`
    // 执行查询
    db.get(selectSql, [updateKeyValue], (err, row) => {
        if (err) {
            handleError(err, result, 'InsertOrUpdateFn')
            return
        }
        if (row) {
            //   console.log('找到了匹配的记录:', row)
            updateDataFn(table, updateKey, updateData, result)
            // 根据需要进行更新或其他操作
        } else {
            //   console.log('没有找到匹配的记录')
            insertDataFn(table, updateData, result)
            // 根据需要进行插入或其他操作
        }
    })
}
/**
 * 查询所有数据
 * @param {string} table - 要查询的表格名称
 * @param {Array} keys - 要查询的列名数组
 * @param {Object} result - 用于返回HTTP响应的对象
 */
const GetAllData = async (table, keys, result,) => {
    return new Promise((resolve, reject) => {
        let selectSql = `SELECT * FROM ${table};`
        // 查询数据
        if (keys.length > 0) {
            const keysStr = keys.map((item) => {
                return `${item}`
            }).join(',')
            selectSql = `SELECT ${keysStr} FROM ${table};`
        }

        db.all(selectSql, [], (err, rows) => {
            if (err) {
                result && result.status(200).json({
                    res_code: -1,
                    res_message: err.message,
                })
                console.log('getAllData >>>', err)
                return reject(err)
            } else {
                result && result.status(200).json({
                    res_code: 0,
                    res_message: '查询成功',
                    data: rows,
                })
                return resolve(rows)
                //   console.log('getAllData >>>', rows)
            }
        })
    })

}
const selectFn = async (table, key, value, result) => {
    // 查询数据
    const selectSql = `SELECT * FROM ${table} WHERE ${key} = ?;`
    db.all(selectSql, [value], (err, rows) => {
        if (err) {
            result && result.status(500).json({
                res_code: -1,
                res_message: err.message,
            })
            console.log('查询数据selectFn >>>', err)
        } else {
            result && result.status(200).json({
                res_code: 0,
                res_message: '查询成功',
                data: rows,
            })

        }
    })
}
//////////////////// ------------- 分割线 ----------------- ////////////////////
/**
 * 批量插入云盘账号
 * @param {Array} updateDatas - 要插入的数据数组，每个元素都是一个对象，包含account和password属性
 * @param {Object} result - 用于返回HTTP响应的对象
 */
const InsertOrUpdateCloudUserFn = async (updateDatas, result) => {
    const usersStr = updateDatas.map((item) => {
        const { account, password, cookies = '' } = item
        return `('${account}', '${encrypt(password)}','${cookies}')`
    }).join(',')
    const sql = `INSERT INTO cloud_users (account, password,cookies) VALUES
  ${usersStr}
  ON CONFLICT(account) 
  DO UPDATE SET 
  cookies=excluded.cookies,
  password=excluded.password;`
    db.run(sql, [], function (err) {
        if (err) {
            handleError(err, result, '批量插入云盘账号 updateCloudUsersFn')
        } else {
            result && result.status(200).json({
                res_code: 0,
                res_message: '更新成功',
            })
        }
    })
}
/**
 * 批量删除数据
 * @param {string} table - 要删除数据的表格名称
 * @param {string} key - 要删除数据的主键名
 * @param {string} values - 要删除数据的键值
 * @param {Object} result - 用于返回HTTP响应的对象
 */
const BatchDeleteFn = async (table, key, values, result) => {
    const valStr = values.map(v => `'${v}'`).join(',');
    const delSql = `DELETE FROM ${table} WHERE ${key} IN (${valStr});`
    db.run(delSql, [], function (err) {
        if (err) {
            handleError(err, result, '删除数据失败 BatchDeleteFn >>>')
        } else {
            result && result.status(200).json({
                res_code: 0,
                res_message: '删除成功',
            })
        }
    })
}
/**
 * 批量查询数据
 * @param {string} table - 要查询的表格名称
 * @param {string} key - 要查询的键名
 * @param {string} values - 要查询的键值
 * @param {Object} result - 用于返回HTTP响应的对象
 * 
 */
const BatchSelectFn = async (table, key, values, result) => {
    const valStr = values.map(v => `'${v}'`).join(',');
    const selectSql = `SELECT * FROM ${table} WHERE ${key} IN (${valStr});`
    db.all(selectSql, [], (err, rows) => {
        if (err) {
            handleError(err, result, 'BatchSelectFn 批量查询数据');
        } else {
            result && result.status(200).json({
                res_code: 0,
                res_message: '查询成功',
                data: rows,
            })
        }
    })
}
/**
 * 查询单条数据
 * @param {*} table 表名
 *  @param {*} key  字段名
 * @param {*} value  字段值
 * @param {*} result  返回结果
 * @param {*} keys 需要返回的字段
  */
const getOneData = (table, key, value, result, keys) => {
    return new Promise((resolve, reject) => {
        let selectSql = `SELECT * FROM ${table} WHERE ${key} = ?;`
        if (keys) {
            const keysStr = keys.map((item) => {
                return `${item}`
            }).join(',')
            selectSql = `SELECT ${keysStr} FROM ${table} WHERE ${key} = ?;`
        }
        db.get(selectSql, [value], (err, row) => {
            if (err) {
                handleError(err, result, 'getOneData 单个查询数据');
                return reject(err)
            } else {
                result && result.status(200).json({
                    res_code: 0,
                    res_message: '查询成功',
                    data: row,
                })
                return resolve(row)
            }
        })
    })

}

/**
 * 单个云盘登录
 * @param {string} account - 云盘账号
 * @param {Object} result - 用于返回HTTP响应的对象
 */
const LoginByAccountFn = async (account, result) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM cloud_users WHERE account = ?`, [account], (err, row) => {
            if (err) {
                handleError(err, result, '单个云盘登录 LoginByAccountFn')
                return reject(err)
            } else {
                if (row.account) {
                    const password = decrypt(row.password)
                    loginFn(row.account, password).then(res => {
                        const cookies = setCookies(res)
                        updateDataFn('cloud_users', 'account', { account, cookies }).then(() => {
                            resolve({ account, cookies })
                        }).catch((updateDataFnErr) => {
                            handleError(updateDataFnErr, result, '单个云盘登录 updateDataFn')
                            reject(updateDataFnErr)
                        })
                        result && result.status(200).json({
                            res_code: 0,
                            res_message: '查询成功',
                            data: {
                                account, cookies
                            },
                        })
                    }).catch((loginFnErr) => {
                        handleError(loginFnErr, result, '单个云盘登录 loginFn')
                        reject(loginFnErr)
                    })
                }
            }
        })
    })

}

export default {
    getAllTasks, insertDataFn, GetAllData,
    updateDataFn, InsertOrUpdateFn, selectFn,
    InsertOrUpdateCloudUserFn, BatchDeleteFn,
    BatchSelectFn, LoginByAccountFn, getOneData
}
