declare module 'expo-sqlite' {
    type ErrorCallback = (err?: Error) => void;
    type StatementCallback = (transaction: SQLTransaction, resultSet: SQLResultSet) => void;
    type StatementErrorCallback = (transaction: SQLTransaction, error: SQLError) => void;
    type TransactionCallback = (transaction: SQLTransaction) => void;
    type TransactionErrorCallback = (error: SQLError) => void;
    type TransactionSuccessCallback = () => void;
  
    export interface SQLTransaction {
      executeSql(
        sqlStatement: string,
        args?: any[],
        callback?: StatementCallback,
        errorCallback?: StatementErrorCallback
      ): void;
    }
  
    export interface SQLResultSet {
      insertId: number;
      rowsAffected: number;
      rows: {
        length: number;
        item: (index: number) => any;
        _array: any[];
      };
    }
  
    export interface SQLError extends Error {
      code: number;
    }
  
    export interface Database {
      transaction(
        callback: TransactionCallback,
        errorCallback?: TransactionErrorCallback,
        successCallback?: TransactionSuccessCallback
      ): void;
      readTransaction(
        callback: TransactionCallback,
        errorCallback?: TransactionErrorCallback,
        successCallback?: TransactionSuccessCallback
      ): void;
      closeAsync(): Promise<void>;
      deleteAsync(): Promise<void>;
    }
  
    export function openDatabase(
      name: string,
      version?: string,
      description?: string,
      size?: number,
      callback?: () => void
    ): Database;
  }